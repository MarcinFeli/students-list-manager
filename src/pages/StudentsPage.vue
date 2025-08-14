<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="text-h6">{{ t('students.add') }}</q-card-section>
          <q-separator />
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input v-model="firstName" :label="t('students.firstName')" dense outlined required />
              <q-input v-model="lastName" :label="t('students.lastName')" dense outlined required />
              <q-select
                v-model="classId"
                :options="classOptions"
                :label="t('students.class')"
                dense outlined
                emit-value map-options clearable
              />
              <div class="q-gutter-sm">
                <q-btn type="submit" color="primary" :label="t('students.save')" />
                <q-btn flat @click="resetForm" label="Reset" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section class="text-h6">{{ t('students.title') }}</q-card-section>
          <q-separator />
          <q-card-section>
            <q-table
              :rows="rows"
              :columns="columns"
              row-key="id"
              flat
              dense
              binary-state-sort
              v-model:pagination="pagination"
              :rows-per-page-label="t('table.rowsPerPage')" 
              :pagination-label="(start, end, total) => t('table.range', { start, end, total })"
              no-data-label="—"
            >
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    v-if="props.row.classId"
                    size="sm"
                    flat
                    color="negative"
                    :label="t('classes.unassign')"
                    @click="store.unassignStudentFromClass(props.row.id)"
                  />
                  <q-btn
                    size="sm"
                    flat
                    color="negative"
                    icon="delete"
                    @click="onDelete(props.row)"
                    />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSchoolStore } from 'src/stores/school'

const { t } = useI18n()
const store = useSchoolStore()


const firstName = ref('')
const lastName = ref('')
const classId = ref(null)

const classOptions = computed(() =>
  store.classes.map((c) => ({ label: c.name, value: c.id }))
)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: null, 
  descending: false
})

const plSort = (a, b) => {
  const av = (a ?? '').toString()
  const bv = (b ?? '').toString()
  return av.localeCompare(bv, 'pl', { sensitivity: 'base' })
}

const columns = computed(() => [
  {
    name: 'firstName',
    label: t('students.firstName'),
    field: 'firstName',
    align: 'left',
    sortable: true,
    sort: plSort
  },
  {
    name: 'lastName',
    label: t('students.lastName'),
    field: 'lastName',
    align: 'left',
    sortable: true,
    sort: plSort
  },
  {
    name: 'class',
    label: t('students.class'),
    field: 'className',
    align: 'left',
    sortable: true,
    sort: plSort,
    format: (val) => val || t('students.none')
  },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
])

const rows = computed(() =>
  store.students.map((s) => ({
    ...s,
    className: store.classById(s.classId)?.name || ''
  }))
)

function resetForm() {
  firstName.value = ''
  lastName.value = ''
  classId.value = null
}

function onSubmit() {
  store.addStudent({
    firstName: firstName.value,
    lastName: lastName.value,
    classId: classId.value || null
  })
  resetForm()
}

async function onDelete(row) {
    await store.removeStudent(row.id)
}
</script>