import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import adminMessageService from "../services/adminMessageService";
import type { ConversationDto, MessageDto, MessageStatsResponse } from "../services/adminMessageService";

export const useAdminMessages = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<MessageStatsResponse | null>(null);
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalConversations, setTotalConversations] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const loadStats = useCallback(async () => {
    try {
      const statsData = await adminMessageService.getStats();
      setStats(statsData);
    } catch (error) {
      message.error("Không thể tải thống kê");
    }
  }, []);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminMessageService.getConversations({
        pageNumber: currentPage,
        pageSize: pageSize,
        searchQuery: searchQuery || undefined
      });
      setConversations(response.items);
      setTotalConversations(response.totalItems);
      setTotalPages(response.totalPages);
    } catch (error) {
      message.error("Không thể tải danh sách cuộc hội thoại");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoading(true);
    try {
      const response = await adminMessageService.getMessages(conversationId, {
        pageNumber: 1,
        pageSize: 100
      });
      setMessages(response.items);
    } catch (error) {
      message.error("Không thể tải tin nhắn");
    } finally {
      setLoading(false);
    }
  }, []);

  const selectConversation = useCallback(async (conversation: ConversationDto) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.uid);
  }, [loadMessages]);

  const sendMessage = useCallback(async (conversationId: string, messageText: string) => {
    try {
      const response = await adminMessageService.sendMessage(conversationId, messageText);
      if (response.isSuccess) {
        message.success("Đã gửi tin nhắn");
        await loadMessages(conversationId);
        return true;
      } else {
        message.error(response.message || "Không thể gửi tin nhắn");
        return false;
      }
    } catch (error) {
      message.error("Không thể gửi tin nhắn");
      return false;
    }
  }, [loadMessages]);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const response = await adminMessageService.deleteMessage(messageId);
      if (response.isSuccess) {
        message.success("Đã xóa tin nhắn");
        if (selectedConversation) {
          await loadMessages(selectedConversation.uid);
        }
        return true;
      } else {
        message.error(response.message || "Không thể xóa tin nhắn");
        return false;
      }
    } catch (error) {
      message.error("Không thể xóa tin nhắn");
      return false;
    }
  }, [selectedConversation, loadMessages]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadStats(), loadConversations()]);
  }, [loadStats, loadConversations]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    loading,
    stats,
    conversations,
    messages,
    selectedConversation,
    currentPage,
    pageSize,
    totalConversations,
    totalPages,
    searchQuery,
    loadStats,
    loadConversations,
    loadMessages,
    selectConversation,
    sendMessage,
    deleteMessage,
    handleSearch,
    handlePageChange,
    refreshAll
  };
};
