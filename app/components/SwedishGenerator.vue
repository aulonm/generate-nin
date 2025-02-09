<template>
  <ClientOnly fallback-tag="span" fallback="Loading UI...">
    <Form class="flex flex-col items-center">

      <div class="flex max-w-sm items-center justify-center gap-2 mb-8 flex-wrap">
        <h2 class="text-2xl">{{ swedishState.output }}</h2>

      </div>

      <div class="grid sm:grid-cols-3 grid-cols-1 gap-8 justify-evenly w-full">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-4">
            <Button type="button" @click="generateFnr">
              Randomize
            </Button>
            <Button type="button" @click="copyUrlToClipboard">
              Copy
            </Button>
          </div>
        </div>
        <RadioGroup v-model="swedishState.sex" class="h-fit">
          <Label>Gender</Label>
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="1" value="1" />
            <Label for="1">Man</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="0" value="0" />
            <Label for="0">Women</Label>
          </div>
        </RadioGroup>

        <div class="flex flex-col gap-4">

          <div class="flex flex-col gap-2">
            <Label for="age">Age</Label>
            <Input id="age" type="number" v-model="swedishState.age" />
          </div>

          <div class="flex flex-col gap-2">
            <Label for="date">Date of birth</Label>
            <Input id="date" type="date" v-model="swedishState.dob" />
          </div>

          <div class="flex flex-col gap-2">
            <Label>Output format</Label>
            <Select v-model="swedishState.format">
              <SelectTrigger>
                <SelectValue placeholder="Output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">
                  YYMMDDNNNN
                </SelectItem>
                <SelectItem value="short-dash">
                  YYMMDD-NNNN
                </SelectItem>
                <SelectItem value="long">
                  YYYYMMDDNNNN
                </SelectItem>
                <SelectItem value="long-dash">
                  YYYYMMDD-NNNN
                </SelectItem>
              </SelectContent>
            </Select>
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
import { watch, ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const isUpdatingFromDob = ref(false)
const isUpdatingFromAge = ref(false)


const swedishState = useStorage('fnrSwedishFormData', {
  age: "18",
  sex: "1",
  dob: "2007-01-01",
  output: "01010798236",
  format: "long-dash"
})

const { toast } = useToast()

const copyUrlToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(swedishState.value.output);
    toast({
      title: `Copied: ${swedishState.value.output} `,
    });
  } catch {
    toast({
      title: 'Copy failed',
    });
  }
};

watch(() => swedishState.value.age, (newAge) => {
  if (isUpdatingFromDob.value) {
    isUpdatingFromDob.value = false
    return
  }

  if (newAge && Number.parseInt(newAge) < 130) {
    isUpdatingFromAge.value = true

    const desiredAge = Number.parseInt(newAge, 10);
    const pnrLong = format(swedishState.value.output, 'long');

    if (!pnrLong) {
      return;
    };
    const dob = parse(pnrLong);

    if (!dob) {
      return;
    }

    setAge(dob, desiredAge);
    const newPnrLong = generate(dob, pnrLong.slice(8, 11))
    updateState(newPnrLong);
  }
})

watch(() => swedishState.value.format, (newFormat) => {
  const pnr = swedishState.value.output;
  swedishState.value.format = newFormat;
  updateState(pnr);
})

watch(() => swedishState.value.dob, (newDob, oldDob) => {
  const date = newDob && new Date(newDob);

  if (isUpdatingFromAge.value) {
    isUpdatingFromAge.value = false;
    return;
  }

  if (date && newDob !== oldDob && date.toString() !== "Invalid Date") {
    try {
      isUpdatingFromDob.value = true
      const pnrLong = format(swedishState.value.output, 'long');

      if (!pnrLong) {
        return;
      };

      const desiredDob = new Date(newDob);
      const newPnrLong = generate(desiredDob, pnrLong.slice(8, 11))
      updateState(newPnrLong);
    } catch (e) {
      return;
    }
  }
})

watch(() => swedishState.value.sex, (newSex) => {
  const pnrLong = format(swedishState.value.output, 'long');
  const isMale = newSex === '1';

  if (!pnrLong) {
    return;
  }

  const dob = parse(pnrLong);

  if (!dob) {
    return;
  }
  const lastTwo = pnrLong.slice(8, 10);
  const rand = Math.round(Math.random() * 9);

  let lastNum;
  if (isMale) {
    lastNum = rand % 2 === 1 ? rand : (rand + 1) % 10;
  } else {
    lastNum = rand % 2 === 0 ? rand : (rand + 1) % 10;
  }

  const newPnrLong = generate(dob, lastTwo + lastNum);
  updateState(newPnrLong);
})

function updateState(pnr: string) {
  if (typeof pnr !== 'string') {
    return;
  }

  const pnrLong = format(pnr, 'long');

  if (!pnrLong || !validate(pnrLong)) {
    return;
  }

  swedishState.value.sex = isMale(pnrLong) ? '1' : '0';

  const formatName = swedishState.value.format;
  const dob = parse(pnrLong);
  const output = format(pnrLong, formatName);

  if (!output || !dob) {
    return;
  }

  swedishState.value.dob = `${dob.getFullYear()}-${pad(dob.getMonth() + 1)}-${pad(dob.getDate())}`;
  swedishState.value.age = getAge(dob).toString();
  swedishState.value.output = output;
}

// returns the underlying date of birth, or null if pnr is invalid (in the date component)
function parse(pnrLong: string) {
  const date = new Date();
  const yearInt = parseInt(pnrLong.slice(0, 4), 10);

  if (!isFinite(yearInt) || isNaN(yearInt)) {
    return null;
  };

  const monthInt = parseInt(pnrLong.slice(4, 6), 10);

  if (!isFinite(monthInt) || isNaN(monthInt) || monthInt > 12 || monthInt < 1) {
    return null;
  };

  const dateInt = parseInt(pnrLong.slice(6, 8), 10);

  if (!isFinite(dateInt) || isNaN(dateInt) || dateInt > 31 || dateInt < 1) {
    return null;
  };

  date.setFullYear(yearInt);
  date.setMonth(monthInt - 1);
  date.setDate(dateInt);

  return isNaN(date.getMilliseconds()) ? null : date;
}

// returns true if the given pnr is for a male, false for female
function isMale(pnrLong: string) {
  const num = parseInt(pnrLong.charAt(10), 10);
  return num % 2 === 1;
}

// returns true if the given pnr is valid, including verifying checksum
function validate(pnrLong: string) {
  if (typeof (pnrLong) !== 'string' || pnrLong.length !== 12) {
    return false;
  };

  const dob = parse(pnrLong);

  if (dob === null) {
    return false;
  };

  const pnrShort = format(pnrLong, 'short');

  if (!pnrShort) {
    return false;
  }

  const checksum = calculateChecksum(pnrShort.slice(0, -1));
  return pnrLong.slice(-1) === checksum;
}

// returns the age of a date
function getAge(dob: Date) {
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    return age - 1;
  }

  return age;
}

function setAge(dob: Date, toAge: number) {
  const age = getAge(dob);
  dob.setFullYear(dob.getFullYear() + (age - toAge));
  return dob;
}

// returns a pnr in "long" format
function generate(dob: Date, lastThree: string) {
  if (!(dob instanceof Date)) {
    dob = new Date(dob);
  };

  const date = String(dob.getFullYear()) + pad(dob.getMonth() + 1) + pad(dob.getDate());
  const pnrShortNoChecksum = date.slice(2) + lastThree;
  const checksum = calculateChecksum(pnrShortNoChecksum);

  return date + lastThree + checksum;
}

function calculateChecksum(pnrShortNoChecksum: string) {
  let sum = 0;

  for (let i = 0, m = 2; i < pnrShortNoChecksum.length; i++) {
    const n = parseInt(pnrShortNoChecksum.charAt(i), 10) * m;
    sum += n >= 10 ? (n % 10) + 1 : n;
    m = m === 2 ? 1 : 2;
  }

  let checksum = 10 - (sum % 10);

  if (checksum === 10) {
    checksum = 0
  };

  return String(checksum);
}

function format(pnr: string, formatName: string) {
  const currentFormat = determineFormat(pnr);

  if (!currentFormat) {
    return;
  };

  let pnrLong = pnr;
  switch (currentFormat) {
    case 'long-dash':
      pnrLong = pnr.replace(/[+-]/, '');
      break;
    case 'short-dash':
    case 'short':
      // plus sign gets added when a person is more than 100 years old
      const lastTwoNow = (new Date()).getFullYear() - 2000;
      const lastTwoPnr = parseInt(pnr.slice(0, 2), 10);
      const pnrShort = pnrLong = pnr.replace(/[+-]/, '');

      if (0 <= lastTwoPnr && lastTwoPnr <= lastTwoNow) {
        const isOld = /\+/.test(pnr);
        pnrLong = isOld ? '19' + pnrShort : '20' + pnrShort; // this is not correct, fix
      } else {
        pnrLong = '19' + pnrShort;
      }
      break;
    default:
      break;
  }

  const dob = parse(pnrLong);
  if (dob === null) {
    return '';
  }

  const age = getAge(dob);
  const sep = age >= 100 ? '+' : '-';

  switch (formatName) {
    default:
    case 'long': return pnrLong;
    case 'long-dash': return pnrLong.slice(0, 8) + sep + pnrLong.slice(8);
    case 'short': return pnrLong.slice(2);
    case 'short-dash': return pnrLong.slice(2, 8) + sep + pnrLong.slice(8);
  }
}

function determineFormat(pnr: string) {
  if (typeof pnr !== 'string') return;
  if (pnr.length === 10) return 'short';
  if (pnr.length === 11) return 'short-dash';
  if (pnr.length === 12) return 'long';
  if (pnr.length === 13) return 'long-dash';
}

function pad(num: number) {
  const str = String(num);
  return str.length < 2 ? '0' + str : str;
}

function randomizeLastThree() {
  const min = 0;
  const max = 999;
  const str = String(Math.round(Math.random() * (max - min) + min));

  if (str.length < 2) {
    return '00' + str;
  };

  if (str.length < 3) {
    return '0' + str;
  };

  return str;
}

const generateFnr = () => {
  const today = new Date();
  const longTimeAgo = new Date();
  longTimeAgo.setFullYear(today.getFullYear() - 99);
  const min = longTimeAgo.valueOf();
  const max = today.valueOf();
  const dob = new Date(Math.random() * (max - min) + min);

  const lastThree = randomizeLastThree();
  const pnrLong = generate(dob, lastThree);
  updateState(pnrLong);
}
</script>