<template>
  <ClientOnly fallback-tag="span" fallback="Loading UI...">
    <Form class="flex flex-col items-center">

      <div class="flex max-w-sm items-center justify-center gap-2 mb-8 flex-wrap">
        <h2 class="text-2xl">{{ norwegianState.output.replace(/^(\d{6})(\d{5})/g, '$1 $2') }}</h2>

      </div>

      <div class="grid sm:grid-cols-3 grid-cols-1 gap-8 justify-evenly w-full">
        <div class="flex flex-col gap-4">

          <Button type="button" @click="generateFnr">
            Randomize
          </Button>
          <Button type="button" @click="copyUrlToClipboard">
            Copy
          </Button>
        </div>
        <div class="flex h-fit flex-row w-full md:justify-start justify-center gap-20">
          <RadioGroup v-model="norwegianState.sex">
            <Label>Gender</Label>
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="1" value="1" />
              <Label for="1">Man</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="0" value="0" />
              <Label for="0">Woman</Label>
            </div>
          </RadioGroup>

          <RadioGroup v-model="norwegianState.type">
            <Label>Type</Label>
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="fnr" value="fnr" />
              <Label for="fnr">Fnr</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="dnr" value="dnr" />
              <Label for="dnf">Dnr</Label>
            </div>
          </RadioGroup>
        </div>

        <div class="flex flex-col gap-4 w-full">

          <div class="flex flex-col gap-2">
            <Label for="age">Age</Label>
            <Input id="age" type="number" v-model="norwegianState.age" />
          </div>

          <div class="flex flex-col gap-2">
            <Label for="date">Date of birth</Label>
            <Input id="date" class="w-full" type="date" v-model="norwegianState.dob" />
          </div>
        </div>
      </div>
    </Form>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Input } from './ui/input'
import { useToast } from './ui/toast/use-toast'
import { Button } from './ui/button'
import { useStorage } from '@vueuse/core'
import { Form } from './ui/form'
import navFaker from '@aulonm/nav-faker'
import { watch, ref } from 'vue'


const isUpdatingFromDob = ref(false)
const isUpdatingFromAge = ref(false)

const norwegianState = useStorage('fnrNorwegianFormData', {
  age: "18",
  sex: "1",
  type: 'fnr',
  dob: "2007-01-01",
  output: "01010798236",
})

const { toast } = useToast()

const generateFnr = () => {
  const fnr = norwegianState.value.type === 'fnr' ? navFaker.personIdentifier.fnr() : navFaker.personIdentifier.dnr();

  const date = navFaker.personIdentifier.getBirthDate(fnr)

  norwegianState.value.output = fnr;
  norwegianState.value.age = navFaker.personIdentifier.getAge(fnr).toString();
  norwegianState.value.sex = Number.parseInt(fnr.replace(/[^0-9]/g, '').charAt(8)) % 2 === 0 ? '0' : '1';
  norwegianState.value.dob = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

const copyUrlToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(norwegianState.value.output);
    toast({
      title: `Copied: ${norwegianState.value.output} `,
    });
  } catch {
    toast({
      title: 'Copy failed',
    });
  }
};

watch(() => norwegianState.value.type, (newType) => {
  const fnr = newType === 'fnr' ? navFaker.personIdentifier.fnr(new Date(norwegianState.value.dob), Number.parseInt(norwegianState.value.sex)) : navFaker.personIdentifier.dnr(new Date(norwegianState.value.dob), Number.parseInt(norwegianState.value.sex));

  norwegianState.value.output = fnr;
})

watch(() => norwegianState.value.age, (newAge) => {
  if (isUpdatingFromDob.value) {
    isUpdatingFromDob.value = false
    return
  }

  if (newAge && Number.parseInt(newAge) < 130) {
    isUpdatingFromAge.value = true
    const today = new Date();
    const birthYear = today.getFullYear() - Number.parseInt(newAge);

    norwegianState.value.dob = norwegianState.value.dob.replace(/(\d{4})-(\d{2})-(\d{2})/g, `${birthYear}-$2-$3`);

    const fnr = norwegianState.value.type === 'fnr' ? navFaker.personIdentifier.fnr(new Date(norwegianState.value.dob), Number.parseInt(norwegianState.value.sex)) : navFaker.personIdentifier.dnr(new Date(norwegianState.value.dob), Number.parseInt(norwegianState.value.sex))

    norwegianState.value.output = fnr;
  }
})

watch(() => norwegianState.value.sex, (newSex, oldSex) => {
  if (newSex !== oldSex) {

    const fnr = norwegianState.value.type === 'fnr' ? navFaker.personIdentifier.fnr(new Date(norwegianState.value.dob), Number.parseInt(norwegianState.value.sex)) : navFaker.personIdentifier.dnr(new Date(norwegianState.value.dob), Number.parseInt(norwegianState.value.sex))

    norwegianState.value.output = fnr;
  }
})

watch(() => norwegianState.value.dob, (newDob, oldDob) => {
  const date = newDob && new Date(newDob);

  if (isUpdatingFromAge.value) {
    isUpdatingFromAge.value = false;
    return;
  }

  if (date && newDob !== oldDob && date.toString() !== "Invalid Date") {
    try {
      isUpdatingFromDob.value = true

      const fnr = norwegianState.value.type === 'fnr' ? navFaker.personIdentifier.fnr(date, Number.parseInt(norwegianState.value.sex)) : navFaker.personIdentifier.dnr(date, Number.parseInt(norwegianState.value.sex))
      norwegianState.value.output = fnr

      // Temporarily remove the age watch
      const age = navFaker.personIdentifier.getAge(fnr);
      norwegianState.value.age = age.toString()
    } catch (e) {
      return;
    }
  }
})
</script>