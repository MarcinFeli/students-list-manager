<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" class="lt-md" @click="left = !left" />
        <q-toolbar-title>{{ t('app.title') }}</q-toolbar-title>
        <q-space />
        <q-btn-toggle
          v-model="localeRef"
          :options="[{label: 'PL', value: 'pl'}, {label: 'EN', value: 'en'}]"
          size="sm"
          glossy
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" show-if-above bordered>
      <q-list>
        <q-item clickable :to="{ name: 'students' }">
          <q-item-section avatar><q-icon name="school" /></q-item-section>
          <q-item-section>{{ t('nav.students') }}</q-item-section>
        </q-item>
        <q-item clickable :to="{ name: 'classes' }">
          <q-item-section avatar><q-icon name="groups" /></q-item-section>
          <q-item-section>{{ t('nav.classes') }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSchoolStore } from 'src/stores/school'

const { t, locale } = useI18n()
const localeRef = ref(locale.value)
watch(localeRef, (val) => {
  locale.value = val
  localStorage.setItem('locale', val)
})

const left = ref(true)

const store = useSchoolStore()
onMounted(() => {
  store.fetchAll()
})
</script>