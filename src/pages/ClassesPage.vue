<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="text-h6">{{ t('classes.add') }}</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="onAdd" class="q-gutter-md">
              <q-input v-model="name" :label="t('classes.name')" dense outlined required />
              <q-btn type="submit" color="primary" :label="t('students.save')" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section class="text-h6">{{ t('classes.title') }}</q-card-section>
          <q-separator />
          <q-list bordered separator>
            <q-item v-for="c in store.classes" :key="c.id" clickable :to="{ name: 'class-details', params: { id: c.id } }">
              <q-item-section avatar><q-icon name="group" /></q-item-section>
              <q-item-section>{{ c.name }}</q-item-section>
              <q-item-section side>
                <q-badge color="primary" :label="store.studentsByClassId(c.id).length" />
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense round color="negative" icon="delete" @click.stop.prevent="onDeleteClass(c)"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSchoolStore } from 'src/stores/school'

const { t } = useI18n()
const store = useSchoolStore()
const name = ref('')

function onAdd() {
  store.addClass(name.value)
  name.value = ''
}
async function onDeleteClass(c) {
 await store.removeClass(c.id)
}
</script>