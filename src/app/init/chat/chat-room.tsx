"use client";

import { HyperList } from "@/components/hyper";
import { RoundCard } from "@/components/hyper/round-card";
import { Button } from "@/components/ui/button";
import { useChatRoom } from "@/hooks/use-chatroom";
import { Icon } from "@/lib/icons";
import { handleAsync } from "@/utils/async-handler";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ver } from "./image-message";
import { ImageUpload } from "./image-upload";
import { MessageBubble } from "./message-bubble";
import type { ApiRoom, Message, User } from "./types";
import { Input } from "@/components/ui/input";
import { usePermissionsCtx } from "@/ctx/permissions";
import { PermissionsModal } from "./permissions";

export const ChatRoom = () => {
  // State
  const [newMessage, setNewMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chatRooms,
    ruesApiCall,
    roomsApiCall,
    loadRoomsAndMessages,
    MOCK_USERS,
  } = useChatRoom();

  const {
    withPermission,
    currentUser,
    activeRoom,
    setCurrentUser,
    setActiveRoom,
    selectedUser,
    onUserSelect,
    showPermissionsModal,
  } = usePermissionsCtx();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatRooms]);

  // Load rooms and messages when user logs in
  useEffect(() => {
    if (currentUser) {
      loadRoomsAndMessages();
      // Poll for updates every 2 seconds
      const interval = setInterval(loadRoomsAndMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [currentUser, loadRoomsAndMessages]);

  // Initialize user with keypair
  const loginUser = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError("");

      try {
        const mockUser = MOCK_USERS.find((u) => u.id === userId);
        if (!mockUser) throw new Error("User not found");

        // Generate keypair for user
        const { keypair } = await ruesApiCall<{
          keypair: { private_key: string; public_key: string };
        }>("/genkeyp");

        const user: User = {
          ...mockUser,
          ...keypair,
        };

        setCurrentUser(user);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to login");
      } finally {
        setIsLoading(false);
      }
    },
    [MOCK_USERS, ruesApiCall, setCurrentUser],
  );

  // Create new chat room
  const createRoom = useCallback(async () => {
    if (!newRoomName.trim() || !currentUser) return;

    setIsLoading(true);
    setError("");

    const { room } = (
      await handleAsync(roomsApiCall)("CREATE_ROOM", {
        name: newRoomName,
        creator: currentUser,
      })
    ).data as { room: ApiRoom };

    if (room) {
      setNewRoomName("");
      setActiveRoom(room.id);
      loadRoomsAndMessages();
    } else {
      setError("Failed to create room");
    }
    setIsLoading(false);
  }, [
    currentUser,
    loadRoomsAndMessages,
    newRoomName,
    roomsApiCall,
    setActiveRoom,
  ]);

  // Join existing room
  const joinRoom = useCallback(
    async (roomId: string) => {
      if (!currentUser) return;

      const { data, error } = await handleAsync(roomsApiCall)("JOIN_ROOM", {
        roomId,
        user: currentUser,
      });

      if (data) {
        setActiveRoom(roomId);
        loadRoomsAndMessages(); // Refresh to get updated member list
      }
      if (error) {
        console.error("Failed to join room:", error);
        setActiveRoom(roomId); // Still allow viewing the room
      }
    },
    [currentUser, loadRoomsAndMessages, roomsApiCall, setActiveRoom],
  );

  // Send encrypted message with selective permissions
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !currentUser || !activeRoom) return;

    setIsLoading(true);
    setError("");

    try {
      const room = chatRooms.find((r) => r.id === activeRoom);
      if (!room) throw new Error("Room not found");

      // Get other members (excluding sender)
      const otherMembers = room.members.filter((m) => m.id !== currentUser.id);

      // Create encrypted versions for each member based on permissions
      const encryptedVersions: { [recipientId: string]: string } = {};

      for (const member of otherMembers) {
        // Check if current user allows this member to decrypt their messages
        const permission = room.permissions?.find(
          (p) => p.fromUserId === currentUser.id && p.toUserId === member.id,
        );

        // Default to allowed if no explicit permission set
        const isAllowed = permission ? permission.allowed : true;

        if (isAllowed) {
          const { encryptedData } = (
            await handleAsync(ruesApiCall)("/encrypt", "POST", {
              publicKey: member.public_key,
              data: newMessage,
            })
          ).data as { encryptedData: string };

          if (encryptedData) {
            encryptedVersions[member.id] = encryptedData;
          } else {
            console.error(`Failed to encrypt for ${member.name}`);
          }
        }
        // If not allowed, don't create an encrypted version for this user
      }

      // Send message to shared API
      await roomsApiCall("SEND_MESSAGE", {
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: newMessage,
        encryptedVersions,
        roomId: activeRoom,
      });

      setNewMessage("");
      loadRoomsAndMessages(); // Refresh to get the new message
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }, [
    activeRoom,
    chatRooms,
    currentUser,
    loadRoomsAndMessages,
    newMessage,
    roomsApiCall,
    ruesApiCall,
  ]);

  // Decrypt message for current user - memoized to prevent infinite re-renders
  const decryptMessage = useCallback(
    async (message: Message | Ver): Promise<string> => {
      if (!currentUser) {
        return "";
      }

      // Show plaintext for own messages (only applies to Message type)
      if ("senderId" in message && message.senderId === currentUser.id) {
        return message.content;
      }

      // Check if there's an encrypted version for current user
      const encryptedForMe = message.encryptedVersions?.[currentUser.id];

      if (!encryptedForMe) {
        // No encrypted version means sender didn't allow this user to decrypt
        return ""; // Return empty string to hide the message completely
      }

      try {
        const { decryptedData } = await ruesApiCall<{ decryptedData: string }>(
          "/decrypt",
          "POST",
          {
            privateKey: currentUser.public_key,
            encryptedData: encryptedForMe,
          },
        );
        return decryptedData;
      } catch (error) {
        console.error("Decryption failed:", error);
        return ""; // Return empty string if decryption fails
      }
    },
    [currentUser, ruesApiCall], // Use specific properties to make it more stable
  );

  const activeRoomData = chatRooms.find((r) => r.id === activeRoom);

  // Set decryption permission for a user

  // Delete room (only for creators)
  const deleteRoom = useCallback(
    async (roomId: string) => {
      if (!currentUser) return;

      const room = chatRooms.find((r) => r.id === roomId);
      if (!room) return;

      // Confirm deletion
      if (
        !confirm(
          `Are you sure you want to delete "${room.name}"? This will permanently delete all messages and cannot be undone.`,
        )
      ) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        await roomsApiCall("DELETE_ROOM", {
          roomId,
          userId: currentUser.id,
        });

        // If the deleted room was active, clear the active room
        if (activeRoom === roomId) {
          setActiveRoom(null);
        }

        loadRoomsAndMessages(); // Refresh the rooms list
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete room");
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeRoom,
      chatRooms,
      currentUser,
      loadRoomsAndMessages,
      roomsApiCall,
      setActiveRoom,
    ],
  );

  // Handle image selection and send as encrypted message
  const handleImageSelect = useCallback(
    async (imageData: string, fileName: string) => {
      if (!currentUser || !activeRoom) return;

      setIsLoading(true);
      setError("");

      try {
        const room = chatRooms.find((r) => r.id === activeRoom);
        if (!room) throw new Error("Room not found");

        // Get other members (excluding sender)
        const otherMembers = room.members.filter(
          (m) => m.id !== currentUser.id,
        );

        // Create encrypted versions for each member based on permissions
        const encryptedVersions: { [recipientId: string]: string } = {};

        for (const member of otherMembers) {
          // Check if current user allows this member to decrypt their messages
          const permission = room.permissions?.find(
            (p) => p.fromUserId === currentUser.id && p.toUserId === member.id,
          );

          // Default to allowed if no explicit permission set
          const isAllowed = permission ? permission.allowed : true;

          if (isAllowed) {
            try {
              const { encryptedData } = await ruesApiCall<{
                encryptedData: string;
              }>("/encrypt", "POST", {
                publicKey: member.public_key,
                data: imageData, // Encrypt the base64 image data
              });
              encryptedVersions[member.id] = encryptedData;
            } catch (e) {
              console.error(`Failed to encrypt image for ${member.name}:`, e);
            }
          }
        }

        // Send image message to shared API
        await roomsApiCall("SEND_MESSAGE", {
          senderId: currentUser.id,
          senderName: currentUser.name,
          content: imageData, // Store original image data for sender
          encryptedVersions,
          roomId: activeRoom,
          messageType: "image",
          fileName,
        });

        loadRoomsAndMessages(); // Refresh to get the new message
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to send image");
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeRoom,
      chatRooms,
      currentUser,
      loadRoomsAndMessages,
      roomsApiCall,
      ruesApiCall,
    ],
  );

  const onLogout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const data = useMemo(() => {
    const allUsers = MOCK_USERS.map((e) => ({
      ...e,
      fn: loginUser,
    }));
    if (currentUser) {
      return allUsers.filter((user) => user.id !== currentUser.id);
    }
    return allUsers;
  }, [MOCK_USERS, loginUser, currentUser]);

  // Login screen
  if (!currentUser) {
    return (
      <div className="relative z-20">
        <h2 className="font-sans text-center h-20 text-2xl tracking-tighter">
          Select your Avatar
        </h2>
        <div className="flex justify-evenly gap-8">
          <HyperList
            container="flex gap-10 p-4"
            direction="right"
            data={data}
            component={RoundCard}
          />
        </div>
        {isLoading && (
          <p
            style={{ textAlign: "center", marginTop: "16px", color: "#cbd5e1" }}
          >
            Generating keypair...
          </p>
        )}
        {error && (
          <p className="text-orange-300 text-center text-lg h-12">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto rounded-sm bg-slate-300/20 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-300/10 p-3 flex justify-between items-center">
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
            Hi, {currentUser.name}!
          </h2>
          {/* <p
            style={{ fontSize: "0.875rem", opacity: 0.75, margin: "4px 0 0 0" }}
          >
            Public Key: {currentUser.public_key.substring(0, 20)}...
          </p> */}
        </div>
        <Button onClick={onLogout} variant="secondary">
          Logout
        </Button>
      </div>

      <div className="flex h-[60lvh]">
        {/* Sidebar - Rooms */}
        <div className="w-1/3 border-r bg-slate-200/20 p-4">
          <div>
            <h3 className="h-8">Create Room</h3>
            <div className="flex gap-4 space-y-4">
              <Input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name"
                onKeyDown={(e) => e.key === "Enter" && createRoom()}
                className="my-2 bg-input py-2 rounded-lg px-3"
              />
              <Button
                size={"icon"}
                onClick={createRoom}
                className="hover:bg-[#059669] bg-[#10b981] grow-0"
              >
                <Icon name="px-check" solid className="size-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3>Chat Rooms</h3>
            <div className="flex flex-col gap-4">
              {chatRooms.map((room) => (
                <div key={room.id} className="">
                  <div
                    onClick={() => joinRoom(room.id)}
                    className="hover:bg-slate-300/20 rounded p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{room.name}</div>
                      {room.creatorId === currentUser?.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRoom(room.id);
                          }}
                          className="hover:bg-[#b91c1c]"
                          title="Delete room (creator only)"
                        >
                          -
                        </button>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center">
                      <Icon name="px-user" className="size-4" solid />
                      <span className="text-sm ml-1.5">
                        {room.members.length}
                      </span>
                      <div className="w-6 h-px" />
                      <Icon name="px-chat" className="size-4" solid />
                      <span className="text-sm ml-1.5">
                        {room.messages.length}
                      </span>
                      <span>
                        {room.creatorId === currentUser?.id && (
                          <span style={{ marginLeft: "8px", color: "#fbbf24" }}>
                            &middot;
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col w-full relative z-40">
          {activeRoomData ? (
            <>
              {/* Room Header */}
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #475569",
                }}
              >
                <h3 style={{ fontWeight: "bold", margin: 0, color: "#f1f5f9" }}>
                  {activeRoomData.name}
                </h3>
                <div className="border bg-orange-300">
                  Members:
                  {activeRoomData.members.map((member, index) => (
                    <span key={member.id}>
                      {member.id === currentUser.id ? (
                        <span
                          className="bg-pink-400"
                          style={{ color: "#60a5fa" }}
                        >
                          {member.name} (you)
                        </span>
                      ) : (
                        <span
                          onClick={() => onUserSelect}
                          style={{
                            color: withPermission(member.id)
                              ? "#10b981"
                              : "#ef4444",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          title={`Click to ${withPermission(member.id) ? "block" : "allow"} ${member.name} from reading your messages`}
                        >
                          {member.name}{" "}
                          {withPermission(member.id) ? "✅" : "🚫"}
                        </span>
                      )}
                      {index < activeRoomData.members.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages */}

              <div className="flex flex-col h-full p-4 overflow-y-auto gap-3">
                {activeRoomData.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    currentUserId={currentUser.id}
                    decryptMessage={decryptMessage}
                    isOwn={message.senderId === currentUser.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div
                className=""
                style={{
                  padding: "16px",
                  backgroundColor: "#334155",
                  borderTop: "1px solid #475569",
                }}
              >
                <div
                  style={{
                    gap: "8px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <ImageUpload
                    disabled={isLoading}
                    onImageSelect={handleImageSelect}
                  />
                  <input
                    type="text"
                    value={newMessage}
                    placeholder="Type your message..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                      flex: 1,
                      color: "#f1f5f9",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !newMessage.trim()}
                    style={{
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "4px",
                      padding: "8px 24px",
                      backgroundColor: "#3b82f6",
                      opacity: isLoading || !newMessage.trim() ? 0.5 : 1,
                    }}
                    className="hover:bg-[#2563eb] bg-[#3b82f6]"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-24 flex justify-center items-center">
              Select a room to start chatting
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-orange-200 p-4 font-mono border-t">
          Error: {error}
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <PermissionsModal selectedUser={selectedUser} />
      )}
    </div>
  );
};
