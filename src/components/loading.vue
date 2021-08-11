<template>
    <!-- 封装一个pc 专用的 loading -->
    <div class="loading_vue">
        <div class="loading-wrapper">
            <div class="loading-view">
                <div class="container1">
                    <div class="circle circle1"></div>
                    <div class="circle circle2"></div>
                    <div class="circle circle3"></div>
                    <div class="circle circle4"></div>
                </div>
                <div class="container2">
                    <div class="circle circle1"></div>
                    <div class="circle circle2"></div>
                    <div class="circle circle3"></div>
                    <div class="circle circle4"></div>
                </div>
            </div>
            <div class="tip-view">Loading</div>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style scoped lang="less">
    .loading_vue{
        .loading-wrapper {
            width: 150px;
            height: 150px;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            color: #fff;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            .loading-view {
                height: 40px;
                position: relative;
                .container1,
                .container2 {
                    width: 40px;
                    height: 40px;
                    position: absolute;
                    /* border: 1px solid #ff0000; */
                    top: 0;
                    left: 50%;
                    margin-left: -20px;
                    position: absolute;
                    .circle{
                        width: 10px;
                        height: 10px;
                        background-color: #fff;
                        border-radius: 50%;
                        animation: loading 1.2s both infinite;
                        &.circle1 {
                            top: 0;
                            left: 0;
                        }
                        &.circle2 {
                            top: 0;
                            right: 0;
                        }
                        &.circle3 {
                            bottom: 0;
                            right: 0;
                        }
                        &.circle4 {
                            bottom: 0;
                            left: 0;
                        }
                    }
                }
                .container1{
                    .circle1 {
                        animation-delay: 0s;
                    }
                    .circle2 {
                        animation-delay: 0.3s;
                    }
                    .circle3 {
                        animation-delay: 0.5s;
                    }
                    .circle4 {
                        animation-delay: 0.7s;
                    }
                }
                .container2 {
                    transform: rotate(45deg);
                    .circle1 {
                        animation-delay: 0.2s;
                    }
                    .circle2 {
                        animation-delay: 0.4s;
                    }
                    .circle3 {
                        animation-delay: 0.6s;
                    }
                    .circle4 {
                        animation-delay: 0.8s;
                    }
                }
            }
        }
    }
    @keyframes loading {
        0% {
            transform: scale(0);
        }

        40% {
            transform: scale(1);
        }

        80% {
            transform: scale(0);
        }

        100% {
            transform: scale(0);
        }
    }
</style>