<template>
  <q-page padding>
    <q-card v-if="klass">
      <q-card-section class="row items-center">
        <div class="text-h6 q-mr-md">{{ t('classes.details') }}: {{ klass.name }}</div>
        <q-space />
        <q-select
          v-model="selectedStudentId"
          :options="unassignedOptions"
          :label="t('classes.addStudent')"
          dense outlined emit-value map-options clearable
          style="min-width: 260px"
        />
        <q-btn
          class="q-ml-sm"
          color="primary"
          :label="t('students.save')"
          :disable="!selectedStudentId"
          @click="assign"
        />
      </q-card-section>

      <q-separator />
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">{{ t('classes.students') }}</div>

        <q-list bordered separator>
          <q-item v-for="s in assigned" :key="s.id">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>{{ s.firstName }} {{ s.lastName }}</q-item-section>
            <q-item-section side>
              <q-btn
                flat dense color="negative"
                :label="t('classes.unassign')"
                @click="store.unassignStudentFromClass(s.id)"
              />
            </q-item-section>
          </q-item>
          <div v-if="assigned.length === 0" class="text-grey text-italic">—</div>
        </q-list>
      </q-card-section>
    </q-card>

    <q-banner v-else class="bg-red-1 text-red-10">{{ t('classes.notfound') }}</q-banner>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSchoolStore } from 'src/stores/school'

const route = useRoute()
const { t } = useI18n()
const store = useSchoolStore()

const klass = computed(() => store.classById(route.params.id))
const assigned = computed(() => store.studentsByClassId(route.params.id))

const unassignedOptions = computed(() =>
  store.students
    .filter((s) => !s.classId)
    .map((s) => ({ label: `${s.firstName} ${s.lastName}`, value: s.id }))
)

const selectedStudentId = ref(null)

function assign() {
  if (!selectedStudentId.value) return
  store.assignStudentToClass(selectedStudentId.value, route.params.id)
  selectedStudentId.value = null
}
</script>