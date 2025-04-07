<script setup lang="ts">
import type { FormState } from "vee-validate";

interface FormStateProp {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
}

const router = useRouter();
const { register } = useAuth();
const loading = ref<boolean>(false);

const formState = reactive<FormStateProp>({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreement: false,
});

const validateConfirmPassword = async (rule: any, value: any) => {
  if (!value) {
    return Promise.reject("Please confirm your password!");
  }
  if (value !== formState.password) {
    return Promise.reject("The two passwords do not match!");
  }
  return Promise.resolve();
};

const onFinish = async (values: FormStateProp) => {
  try {
    loading.value = true;

    const res = await register(values.username, values.email, values.password);

    if (res.message) {
      message.success(res.message);
    }

    router.push("/table");
  } catch (error) {
    message.error("Registration failed. Please try again.");
    console.error("Registration error:", error);
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.error("Failed:", errorInfo);
  message.error("Please check the form for errors.");
};
</script>

<template>
  <a-flex align="center" justify="center" class="h-full">
    <div class="w-full max-w-2xl">
      <a-form
        :model="formState"
        name="register"
        layout="vertical"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input size="large" v-model:value="formState.username">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]"
        >
          <a-input size="large" v-model:value="formState.email">
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters!' },
          ]"
        >
          <a-input-password size="large" v-model:value="formState.password">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          label="Confirm Password"
          name="confirmPassword"
          :rules="[{ validator: validateConfirmPassword }]"
        >
          <a-input-password
            v-model:value="formState.confirmPassword"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="agreement">
          <a-checkbox
            v-model:checked="formState.agreement"
            :rules="[
              {
                required: true,
                message: 'Please agree to the terms and conditions',
              },
            ]"
          >
            I agree to the <a href="#">Terms and Conditions</a>
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block>
            Register
          </a-button>
        </a-form-item>

        <a-form-item>
          <a-flex align="center" justify="center" gap="middle">
            <a-p>Already have an account?</a-p>
            <NuxtLink to="/">Login now</NuxtLink>
          </a-flex>
        </a-form-item>
      </a-form>
    </div>
  </a-flex>
</template>
