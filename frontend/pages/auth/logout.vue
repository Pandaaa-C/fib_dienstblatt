<template>
    <div class="page">
        <img src="@/assets/images/logo.webp" />
        <h1>Schönen Feierabend Agent. Bis zum nächstenmal.</h1>
    </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/config';

definePageMeta({
    middleware: ['router-check'],
});

await useFetch(apiUrl + '/auth/logout', {
    method: 'post',
    credentials: 'include',
});

setTimeout(() => {
    useRouter().push('/auth/login');
}, 5000);
</script>

<style scoped lang="scss">
.page {
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
        width: auto;
        height: 15vw;
        margin-top: 3vw;
    }

    h1 {
        color: #cbcbcb;
        font-size: 0.8vw;
        font-weight: 300;
        margin-top: 1.5vw;
        margin-bottom: 1.5vw;
    }

    input {
        width: 15.6vw;
        height: 2vw;
        margin-top: 1vw;
        background: transparent;
        border: none;
        border-bottom: 0.15vw solid #707070;
        text-indent: 1.6vw;
        background-repeat: no-repeat;
        background-size: 0.8vw;
        background-position: 0.3vw center;
        color: #707070;
        transition: 200ms;
        font-size: 0.7vw;

        &:focus {
            color: white;
            border-bottom-color: red;
        }

        &[type='text'] {
            background-image: url(@/assets/images/user-solid.svg);

            &:focus {
                background-image: url(@/assets/images/user-solid2.svg);
            }
        }

        &[type='password'] {
            background-image: url(@/assets/images/lock-solid.svg);

            &:focus {
                background-image: url(@/assets/images/lock-solid2.svg);
            }
        }
    }

    p {
        color: #cbcbcb;
        font-size: 0.5vw;
        font-weight: 300;
        width: 15.6vw;
        text-align: right;
        margin-top: 0.2vw;
        margin-bottom: 1.5vw;
        cursor: pointer;
    }

    button {
        width: 10.4vw;
        height: 2.5vw;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 0.15vw;
        cursor: pointer;
        color: white;
        font-size: 0.7vw;
    }
}
</style>
