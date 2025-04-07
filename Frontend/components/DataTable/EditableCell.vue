<script setup lang="ts">
import Input from "../ui/input/Input.vue";
import Textarea from "../ui/textarea/Textarea.vue";

interface Props {
  getValue: any;
  row: any;
  column: any;
  table: any;
  inputType: "INPUT" | "TEXTAREA";
  placeholder: string;
}

const props = defineProps<Props>();

const initialValue = props.getValue();

const input = ref<string>(initialValue);
const isInputActive = ref<boolean>(false);
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
const isLoading = ref<boolean>(props.table.options.meta?.isLoading);

const activateInput = async () => {
  isInputActive.value = true;
  await nextTick();
  inputRef.value?.focus();
};

const handleBlur = () => {
  if (isLoading.value) return;
  props.table.options.meta?.updateData(props.row, props.column.id, input.value);
  isInputActive.value = false;
};

watch(
  () => initialValue,
  (newValue) => {
    input.value = newValue;
  }
);
</script>

<template>
  <div>
    <div v-if="props.inputType === 'INPUT'">
      <Input
        v-if="isInputActive"
        :disabled="isLoading"
        v-model="input"
        ref="inputRef"
        :placeholder="props.placeholder"
        class="focus-visible:ring-0 placeholder:capitalize text-foreground bg-transparent"
        :onblur="handleBlur"
      />
    </div>
    <div v-else>
      <Textarea
        v-if="isInputActive"
        :disabled="isLoading"
        v-model="input"
        ref="inputRef"
        :placeholder="props.placeholder"
        class="focus-visible:ring-0 placeholder:capitalize text-foreground bg-transparent"
        :onblur="handleBlur"
      />
    </div>
    <div
      v-if="!isInputActive"
      @click="activateInput"
      class="w-3/4 min-h-10 px-3 cursor-pointer flex items-center hover:bg-muted hover:text-muted-foreground rounded-lg"
      :class="[input ? '' : 'text-muted-foreground capitalize']"
    >
      <p>{{ input || props.placeholder }}</p>
    </div>
  </div>
</template>
