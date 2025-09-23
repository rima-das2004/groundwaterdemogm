import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Bell, 
  BellRing,
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  X,
  Eye,
  Trash2,
  Check,
  Settings
} from 'lucide-react';
import { useNotifications } from './NotificationContext';

export const NotificationBell: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    criticalCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);

  // Trigger animation when new notifications arrive
  React.useEffect(() => {
    if (unreadCount > 0) {
      setPlayAnimation(true);
      setTimeout(() => setPlayAnimation(false), 2000);
    }
  }, [unreadCount]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColors = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      case 'warning':
        return 'border-amber-200 bg-amber-50 hover:bg-amber-100';
      case 'success':
        return 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100';
      default:
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2 hover:bg-primary/10"
        >
          <motion.div
            animate={playAnimation ? {
              scale: [1, 1.3, 1],
              rotate: [0, 15, -15, 0]
            } : {}}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {unreadCount > 0 ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <BellRing className="w-5 h-5 text-primary" />
              </motion.div>
            ) : (
              <Bell className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.div>
          
          {/* Notification Badge */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge 
                  className={`
                    min-w-[20px] h-5 text-xs font-bold px-1 border-2 border-white shadow-lg
                    ${criticalCount > 0 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }
                  `}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Critical Alert Indicator */}
          {criticalCount > 0 && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-96 p-0 mr-4" 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center space-x-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No notifications</p>
                <p className="text-sm text-muted-foreground/70">You're all caught up!</p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="p-2 space-y-1">
                  <AnimatePresence>
                    {notifications.slice(0, 20).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        layout
                        className={`
                          p-3 rounded-lg border transition-all duration-200 cursor-pointer
                          ${!notification.isRead 
                            ? getNotificationColors(notification.type) + ' border-l-4'
                            : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100'
                          }
                        `}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0 ml-2" />
                              )}
                            </div>
                            
                            <p className={`text-xs ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'} line-clamp-2`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-3">
                                {notification.location && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{notification.location}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(notification.timestamp)}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};