import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../types/notification';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    if (!isNotificationDropdownOpen && user) {
      loadNotifications();
    }
  };

  const closeNotificationDropdown = () => {
    setIsNotificationDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeUserDropdown();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 알림 목록 로드
  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoadingNotifications(true);
      const notifications = await notificationService.getNotifications(user.userId);
      setNotifications(notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // 안읽은 알림 개수 로드
  const loadUnreadCount = async () => {
    if (!user) return;
    
    try {
      const response = await notificationService.getUnreadCount(user.userId);
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  // 특정 알림을 읽음으로 표시
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.notificationId === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // 모든 알림을 읽음으로 표시
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.userId);
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // 화면 크기 변경 시 모바일 메뉴 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu-container')) {
        closeUserDropdown();
      }
      if (!target.closest('.notification-container')) {
        closeNotificationDropdown();
      }
    };

    if (isUserDropdownOpen || isNotificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen, isNotificationDropdownOpen]);

  // 안읽은 알림 개수 주기적으로 가져오기
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUnreadCount();
      
      // 30초마다 안읽은 알림 개수 갱신
      const interval = setInterval(loadUnreadCount, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  // 메뉴 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeMobileMenu();
    }
  };

  // 사용자 역할에 따른 메뉴 아이템 렌더링
  const renderMenuItems = () => {
    if (!user) return null;

    switch (user.role) {
      case 'USER':
        return (
          <>
            <Link to="/my-books" className="dropdown-item" onClick={closeUserDropdown}>
              <span className="item-icon">📚</span>
              마이북
            </Link>
            <Link to="/author-apply" className="dropdown-item" onClick={closeUserDropdown}>
              <span className="item-icon">✍️</span>
              작가신청
            </Link>
            <Link to="/points" className="dropdown-item" onClick={closeUserDropdown}>
              <span className="item-icon">💰</span>
              포인트 구매
            </Link>
          </>
        );
      case 'AUTHOR':
        return (
          <>
            <Link to="/my-books" className="dropdown-item" onClick={closeUserDropdown}>
              <span className="item-icon">📚</span>
              마이북
            </Link>
            <Link to="/manuscripts" className="dropdown-item" onClick={closeUserDropdown}>
              <span className="item-icon">📝</span>
              원고관리
            </Link>
            <Link to="/points" className="dropdown-item" onClick={closeUserDropdown}>
              <span className="item-icon">💰</span>
              포인트 구매
            </Link>
          </>
        );
      case 'ADMIN':
        return (
          <Link to="/admin/author-management" className="dropdown-item" onClick={closeUserDropdown}>
            <span className="item-icon">⚖️</span>
            작가신청 관리
          </Link>
        );
      default:
        return null;
    }
  };

  // 모바일 메뉴 아이템 렌더링
  const renderMobileMenuItems = () => {
    if (!user) return null;

    switch (user.role) {
      case 'USER':
        return (
          <>
            <Link to="/my-books" className="mobile-user-item" onClick={closeMobileMenu}>
              <span className="item-icon">📚</span>
              마이북
            </Link>
            <Link to="/author-apply" className="mobile-user-item" onClick={closeMobileMenu}>
              <span className="item-icon">✍️</span>
              작가신청
            </Link>
            <Link to="/points" className="mobile-user-item" onClick={closeMobileMenu}>
              <span className="item-icon">💰</span>
              포인트 구매
            </Link>
          </>
        );
      case 'AUTHOR':
        return (
          <>
            <Link to="/my-books" className="mobile-user-item" onClick={closeMobileMenu}>
              <span className="item-icon">📚</span>
              마이북
            </Link>
            <Link to="/manuscripts" className="mobile-user-item" onClick={closeMobileMenu}>
              <span className="item-icon">📝</span>
              원고관리
            </Link>
            <Link to="/points" className="mobile-user-item" onClick={closeMobileMenu}>
              <span className="item-icon">💰</span>
              포인트 구매
            </Link>
          </>
        );
      case 'ADMIN':
        return (
          <Link to="/admin/author-management" className="mobile-user-item" onClick={closeMobileMenu}>
            <span className="item-icon">⚖️</span>
            작가등록 심사
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          {/* 햄버거 메뉴 버튼 */}
          <button 
            className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기/닫기"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* 데스크톱 네비게이션 */}
          <nav className="nav-menu desktop-nav">
            <Link to="/about" className="nav-item">소개</Link>
            <Link to="/" className="nav-item">전자책</Link>
            <Link to="/plus" className="nav-item">플러스</Link>
          </nav>
        </div>
        
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <span className="logo-text">Chapt</span>
          <span className="logo-version">12</span>
        </Link>
        
        <div className="header-right">
          <div className="search-container desktop-search">
            <input 
              type="text" 
              placeholder="저자, 책제목, 키워드 검색"
              className="search-input"
            />
            <button className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          
          <div className="auth-section">
            {isAuthenticated && user ? (
              <>
                {/* 로그인된 사용자 드롭다운 */}
                <div className="user-menu-container">
                <button 
                  className="user-avatar-btn"
                  onClick={toggleUserDropdown}
                  aria-label="사용자 메뉴"
                >
                  <span className="user-emoji">👤</span>
                  <span className="user-name">{user.name}</span>
                  <svg 
                    className={`dropdown-arrow ${isUserDropdownOpen ? 'open' : ''}`}
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar">👤</div>
                      <div className="user-details">
                        <div className="user-name-text">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <nav className="dropdown-menu">
                      {renderMenuItems()}
                    </nav>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button className="logout-btn" onClick={handleLogout}>
                      <span className="item-icon">🚪</span>
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
              
              {/* 알림 아이콘 (유저 프로필 오른쪽) */}
              <div className="notification-container">
                <button 
                  className="notification-btn"
                  onClick={toggleNotificationDropdown}
                  aria-label="알림"
                >
                  <span className="notification-icon">🔔</span>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </button>

                {isNotificationDropdownOpen && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>알림</h3>
                      {notifications.some(n => !n.isRead) && (
                        <button className="mark-all-read-btn" onClick={markAllAsRead}>
                          모두 읽음
                        </button>
                      )}
                    </div>
                    
                    <div className="notification-list">
                      {isLoadingNotifications ? (
                        <div className="loading-notifications">로딩 중...</div>
                      ) : notifications.length === 0 ? (
                        <div className="no-notifications">새로운 알림이 없습니다</div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.notificationId}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                            onClick={() => !notification.isRead && markAsRead(notification.notificationId)}
                          >
                            <div className="notification-message">
                              {notification.message}
                            </div>
                            <div className="notification-time">
                              {new Date(notification.createdAt).toLocaleDateString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {!notification.isRead && <div className="unread-indicator"></div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              </>
            ) : (
              /* 로그인하지 않은 사용자 */
              <div className="auth-buttons">
                <Link to="/auth" className="login-btn" onClick={closeMobileMenu}>로그인</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={handleOverlayClick}>
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <Link to="/" className="mobile-logo" onClick={closeMobileMenu}>
                <span className="logo-text">Chapt</span>
                <span className="logo-version">12</span>
              </Link>
              <button 
                className="close-menu-btn"
                onClick={closeMobileMenu}
                aria-label="메뉴 닫기"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <nav className="mobile-nav">
              <Link to="/about" className="mobile-nav-item" onClick={closeMobileMenu}>
                <span className="nav-icon">📖</span>
                소개
              </Link>
              <Link to="/" className="mobile-nav-item" onClick={closeMobileMenu}>
                <span className="nav-icon">📚</span>
                전자책
              </Link>
              <Link to="/plus" className="mobile-nav-item" onClick={closeMobileMenu}>
                <span className="nav-icon">⭐</span>
                플러스
              </Link>
            </nav>

            <div className="mobile-search-container">
              <input 
                type="text" 
                placeholder="저자, 책제목, 키워드 검색"
                className="mobile-search-input"
              />
              <button className="mobile-search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="mobile-auth-section">
              {isAuthenticated && user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <span className="mobile-user-avatar">👤</span>
                    <div className="mobile-user-details">
                      <div className="mobile-user-name">{user.name}</div>
                      <div className="mobile-user-email">{user.email}</div>
                    </div>
                    <div className="mobile-notification-icon">
                      <span className="notification-icon">🔔</span>
                      {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mobile-user-menu">
                    {renderMobileMenuItems()}
                  </div>
                  
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    <span className="item-icon">🚪</span>
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="mobile-login-btn" onClick={closeMobileMenu}>
                  로그인 / 회원가입
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;