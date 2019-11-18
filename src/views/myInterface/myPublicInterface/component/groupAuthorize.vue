<template>
  <el-form label-width="80px">
    <el-form-item label="授权用户">
      <el-select v-model="members" multiple filterable remote placeholder="请输入授权用户" :remote-method="remoteMemberMethod"
                 :loading="loading" style="width: 100%">
        <el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id">
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
          <span style="float: left">{{ item.username }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {
    page
  } from '@/api/admin/user/index';
  import {
    getApiusers,
    updateusers
  } from '@/api/myPublish/apiUserMember/index';
  import {mapGetters} from 'vuex';

  export default {
    props: {
      groupId: {
        default: '1'
      }
    },
    data() {
      return {
        mItems: [],
        members: [],
        list: [],
        loading: false,
      }
    },
    created() {
      this.initUsers();
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      remoteMemberMethod(query) {
        if (query !== '') {
          this.loading = true;
          this.loading = false;
          page({
            name: query,
            username: query
          }).then(response => {
            this.mItems = response.data.rows;
            this.total = response.data.total;
            this.loading = false;
          });
        } else {
          this.mItems = [];
        }
      },
      onSubmit() {
        const vals = {};
        if (this.members.length > 0) vals.members = this.members.join();
        updateusers(this.groupId, vals).then(() => {
          this.$emit('closeAuthorizeDialog');
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      initUsers() {
        getApiusers(this.groupId).then(response => {
          this.mItems = response.data.members;
          const mems = [];
          for (let i = 0; i < response.data.members.length; i++) {
            mems.push(response.data.members[i].id);
          }
          this.members = mems;
        });
      }
    }
  }
</script>
