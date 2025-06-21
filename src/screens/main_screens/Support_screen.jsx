import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MessageIcon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/constants';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosService from '../../utils/AxiosService';
import { API_URL } from '@env';

const Support_screen = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);

  const SOCKET_SERVER_URL = 'https://worldofaat.com'; // Replace with your machine's IP

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([getUserData(), getReceiverData()]);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sender && receiver) {
      console.log(`Initializing with sender: ${sender}, receiver: ${receiver}`);
      getMessages();
      const newSocket = io(SOCKET_SERVER_URL, {
        auth: { token: AsyncStorage.getItem('token') }, // Add auth if required
      });
      setSocket(newSocket);

      newSocket.on('receive_message', (data) => {
        setMessages((prevMessages) => {
          if (
            prevMessages.some(
              (msg) =>
                msg.timestamp === data.timestamp && msg.content === data.content,
            )
          ) {
            return prevMessages;
          }
          return [...prevMessages, data];
        });
      });

      newSocket.on('error', (err) => {
        console.error('Socket error:', err);
        setError(err.message || 'Socket connection error');
      });

      newSocket.emit('join_room', sender);

      return () => newSocket.disconnect();
    }
  }, [sender, receiver]);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollToEnd();
    });
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {});
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const scrollToEnd = () => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const getMessages = async () => {
    if (!sender || !receiver) {
      console.log('Skipping getMessages: sender or receiver not set');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log(`Requesting messages from ${sender} to ${receiver}`);
      const res = await AxiosService.post('/customer/GetParticularChat', {
        sender,
        receiver,
        senderModel: 'customers',
        receiverModel: 'admin',
      });
      if (res.status === 200) {
        setMessages(res.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error.response || error);
      const errorMessage =
        error.response?.data?.message || 'Failed to load messages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const data = JSON.parse(userData);
        if (!data._id) {
          throw new Error('User ID not found in AsyncStorage');
        }
        setSender(data._id);
        console.log('Sender set:', data._id);
      } else {
        throw new Error('User data not found in AsyncStorage');
      }
    } catch (err) {
      console.error('Error getting user data:', err);
      throw err;
    }
  };

  const getReceiverData = async () => {
    try {
      const res = await AxiosService.get('/admin/GetAdmin');
      const admin = res.data.admin?.[0]?._id;
      if (admin) {
        setReceiver(admin);
        console.log('Receiver set:', admin);
      } else {
        throw new Error('No admin found');
      }
    } catch (error) {
      console.error('Error fetching receiver data:', error.response || error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (content.trim() === '' || !sender || !receiver) return;

    const messageData = {
      sender,
      receiver,
      content,
      senderModel: 'customers',
      receiverModel: 'admin',
      timestamp: Date.now(),
    };

    try {
      socket.emit('send_message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setContent('');
      scrollToEnd();
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const renderItem = ({ item, index }) => (
    <View key={index} style={{ marginBottom: 15 }}>
      <View
        style={{
          flexDirection: item.sender === sender ? 'row-reverse' : 'row',
        }}
      >
        <MessageIcon
          name='chatbubble-ellipses'
          style={{ marginRight: 5 }}
          size={20}
          color={colors.dark_green}
        />
        <View
          style={[
            styles.messageContainer,
            item.sender === sender
              ? styles.sentMessage
              : styles.receivedMessage,
          ]}
        >
          <Text
            style={
              item.sender === sender
                ? styles.sentMessageText
                : styles.receivedMessageText
            }
          >
            {item.content}
          </Text>
        </View>
      </View>
      <Text
        style={item.sender === sender ? styles.sentTime : styles.receivedTime}
      >
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {loading ? (
        <View style={styles.center}>
          <Text>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: colors.red }}>{error}</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.center}>
          <Image
            style={{
              width: 250,
              height: 200,
              opacity: 0.5,
            }}
            source={require('../../assets/Images/chat-img.png')}
          />
          <Text style={{ marginTop: 10, color: colors.gray }}>
            No messages yet
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          onContentSizeChange={scrollToEnd}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          placeholder='Type a message...'
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name='send' size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 10,
  },
  sentTime: {
    fontSize: 12,
    color: colors.black,
    alignSelf: 'flex-end',
  },
  receivedTime: {
    fontSize: 12,
    color: colors.black,
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    maxWidth: '70%',
  },
  sentMessage: {
    backgroundColor: colors.dark_green,
    alignSelf: 'flex-end',
    marginRight: 5,
    borderRadius: 8,
  },
  receivedMessage: {
    backgroundColor: colors.light_gray,
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  sentMessageText: {
    color: colors.white,
    fontSize: 15,
  },
  receivedMessageText: {
    color: colors.black,
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 0.7,
    borderTopColor: colors.gray,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 0.7,
    borderColor: colors.gray,
    backgroundColor: colors.baby_gray,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: colors.dark_green,
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Support_screen;