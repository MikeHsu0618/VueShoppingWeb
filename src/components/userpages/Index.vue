<template>
    <div>
      
    <UserHeader></UserHeader>

     <router-view></router-view>
     
     <UserFooter/>

    </div>
</template>


<script>
import UserHeader from '@/User/UserHeader'
import UserFooter from '@/User/UserFooter'


export default {
        components:{
        UserHeader,
        UserFooter,
    },

}
</script>