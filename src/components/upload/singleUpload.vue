<template>
   
  <div>
    <el-upload
      action="http://192.168.15.128:9000/test2"
      :data="dataObj"
      list-type="picture"
      :http-request="upload"
      :multiple="false"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :clearOnComplete="true"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过10MB
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { policy } from "./policy";
import { doPut } from "./doPut";
import { getUUID } from "@/utils";

export default {
  name: "singleUpload",
  props: {
    value: String,
  },
  computed: {
    imageUrl() {
      return this.value;
    },
    imageName() {
      if (this.value != null && this.value !== "") {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList() {
      return [
        {
          name: this.imageName,
          url: this.imageUrl,
        },
      ];
    },
    showFileList: {
      get: function () {
        return (
          this.value !== null && this.value !== "" && this.value !== undefined
        );
      },
      set: function (newValue) {},
    },
  },
  data() {
    return {
      params: {
        defaultImgUrl: null,
      },
      dataObj: {
        data: "",
        policy: "",
        signature: "",
        key: "",
        ossaccessKeyId: "",
        dir: "",
        host: "",
        // callback:'',
      },
      dialogVisible: false,
    };
  },
  methods: {
    upload(file, fileList) {
      // let file = res.file; //注意：直接上传file文件，不要用FormData对象的形式传
      let config = {
        headers: {
          // "Content-Type": "multipart/form-data",
          "Content-Type": "image/png",
        },
      };
      console.log(file);

      // file.file.name = file.file.uid + file.file.name

      let _self = this;
      return new Promise((resolve, reject) => {
        doPut(this.dataObj.data, file.file)
          .then((response) => {
            console.log(response);
            // this.dataObj.data = ''
            // file=null
            resolve(true);
          })
          .catch((err) => {
            reject(false);
          });
      });
    },
    emitInput(val) {
      this.$emit("input", val);
    },
    handleRemove(file, fileList) {
      this.emitInput("");
    },
    handlePreview(file) {
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      let _self = this;
      var { uid, name, type, lastModifiedDate } = file;
      console.log(uid);
      console.log(name);
      console.log(type);
      console.log(lastModifiedDate);
      return new Promise((resolve, reject) => {
        policy(uid, name, type, lastModifiedDate)
          .then((response) => {
            _self.dataObj.policy = response.data.policy;
            _self.dataObj.signature = response.data.signature;
            _self.dataObj.ossaccessKeyId = response.data.accessid;
            _self.dataObj.key = response.data.dir + "/" + "_${filename}";
            _self.dataObj.dir = response.data.dir;
            _self.dataObj.host = response.data;
            _self.params.defaultImgUrl = response.data.host;
            _self.dataObj.data = response.data;
            resolve(true);
          })
          .catch((err) => {
            reject(false);
          });
      });
    },
    handleUploadSuccess(res, file) {
      console.log("上传成功...");
      this.showFileList = true;
      this.fileList.pop();
      this.fileList.push({
        // sort: 1,
        name: file.name,
        url: this.dataObj.data.split("?")[0],
        // +
        // "/" +
        // this.dataObj.key.replace("${filename}", file.name),
      });
      this.emitInput(this.fileList[0].url);
    },
  },
};
</script>
<style>
</style>


