<template>
  <h1 class="fade">Ahihhii</h1>


<Teleport to ="body">
  <base-modal 
  theme="example"
  v-if="isShowModal"
  v-on:closeModal="onToggleModal"
  >
  <template v-slot:header>
    <h2>This is the title from App</h2>
  </template>
  <label for="name">Name</label>
  <input type="text" />
  <template v-slot:footer>
    <button @click="onToggleModal">Close</button>
    <h3>This is the footer</h3>
  </template>
</base-modal>
</Teleport>
  <button @click="onToggleModal">Show Modal</button>
</template>

<script>
import Modal from './components/Modal.vue';
export default {
  name: 'App',
  components: {
    baseModal: Modal,
  },
  data() {
    return {
      isShowModal: false
    }
  },
  methods: {
    
    onToggleModal() {
      console.log('Loading..')
      this.isShowModal = !this.isShowModal
    }
  }
}
</script>

<style>
</style>
