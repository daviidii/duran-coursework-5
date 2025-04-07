<script setup lang="ts">
import { ref, reactive } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { useRouter } from "nuxt/app";
import { message } from "ant-design-vue";

interface FormProp {
  email: string;
  password: string;
  remember: boolean;
}

const router = useRouter();
const { login } = useAuth();
const loading = ref<boolean>(false);
const googleLoading = ref(false);
const githubLoading = ref(false);

const formState = reactive<FormProp>({
  email: "",
  password: "",
  remember: false,
});

const registerWithGoogle = async () => {
  try {
    googleLoading.value = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.info("Redirecting to Google authentication...");
  } catch (error) {
    message.error("Google registration failed.");
    console.error("Google registration error:", error);
  } finally {
    googleLoading.value = false;
  }
};

const registerWithGithub = async () => {
  try {
    githubLoading.value = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.info("Redirecting to GitHub authentication...");
  } catch (error) {
    message.error("GitHub registration failed.");
    console.error("GitHub registration error:", error);
  } finally {
    githubLoading.value = false;
  }
};

const onFinish = async (values: FormProp) => {
  try {
    loading.value = true;

    const res = await login(values.email, values.password);

    if (res.user) {
      message.success(res.message);
      navigateTo("/table");
    }
  } catch (error) {
    message.error("Login failed. Please check your credentials.");
    console.error("Login error:", error);
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
        layout="vertical"
        :model="formState"
        name="login"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="email"
          name="email"
          :rules="[{ required: true, message: 'Please input your email.' }]"
        >
          <a-input v-model:value="formState.email" size="large">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password.' }]"
        >
          <a-input-password v-model:value="formState.password" size="large">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="remember">
          <a-checkbox v-model:checked="formState.remember"
            >Remember me</a-checkbox
          >
        </a-form-item>

        <a-form-item>
          <a-button
            size="large"
            type="primary"
            html-type="submit"
            :loading="loading"
            block
          >
            Log in
          </a-button>
        </a-form-item>

        <a-form-item>
          <div class="flex items-center justify-between">
            <NuxtLink to="#">Forgot password?</NuxtLink>
            <NuxtLink to="/register">Register now</NuxtLink>
          </div>
        </a-form-item>

        <a-divider>Or with</a-divider>

        <a-form-item :wrapper-col="{ span: 24 }">
          <a-flex vertical gap="middle">
            <a-button
              size="large"
              type="default"
              @click="registerWithGoogle"
              class="flex items-center justify-center"
              :loading="googleLoading"
              block
            >
              <template #icon><GoogleOutlined /></template>
              Google
            </a-button>
            <a-button
              size="large"
              type="default"
              @click="registerWithGithub"
              class="flex items-center justify-center"
              :loading="githubLoading"
              block
            >
              <template #icon><GithubOutlined /></template>
              GitHub
            </a-button>
          </a-flex>
        </a-form-item>
      </a-form>
    </div>
  </a-flex>
</template>
