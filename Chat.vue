<script setup>
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';

const socket = io('ws://127.0.0.1:8000/ws');
const messages = ref([]);
const message = ref('');

onMounted(() => {
  socket.on('message', (msg) => {
    messages.value.push(msg);
  });
});

const sendMessage = () => {
  socket.emit('message', message.value);
  message.value = '';
};
</script>

<template>
  <div>
    <div v-for="msg in messages" :key="msg">{{ msg }}</div>
    <input v-model="message" @keyup.enter="sendMessage" />
  </div>
</template>
