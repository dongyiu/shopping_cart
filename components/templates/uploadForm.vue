<template>
  <div class="upload">
    <div v-if="isForm" class="upload_form">
      <h1 class="upload_form_title">Upload your image</h1>
      <p class="upload_form_note">File should be Jpeg, Png,...</p>
      <div class="upload_form_main">
        <figure
          class="-drop"
          :class="{ '-active': isDrag }"
          @dragenter="dragEnter"
          @dragleave="dragLeave"
          @dragover.prevent
          @drop.prevent="dropFile"
        >
          <img :src="preview" width="160" height="130" />
          <p class="-text">Drag & Drop your image here</p>
        </figure>
        <p class="-text">Or</p>
        <div class="-button">
          <label class="-label">
            Choose an image
            <input type="file" @change="uploaded" />
          </label>
          <label v-if="file" class="-label">
            Upload image
            <input  type="button" @click="prompDialog" />
          </label>
        </div>
      </div>
    </div>
    <!-- フォーム -->
    <div v-if="isLoading" class="upload_loading">
      <p class="upload_loading_text">Uploading...</p>
      <div class="upload_loading_bar"><span class="-active"></span></div>
    </div>
    <!-- ローディングアニメーション -->
    <div v-if="isFinish" class="upload_finish">
      <p class="upload_finish_check"></p>
      <p class="upload_finish_text">Uploaded Successfully!</p>
      <figure class="upload_finish_img">
        <img :src="preview" width="160" height="130" />
      </figure>
      <div class="upload_finish_urlWrap">
        <input type="text" :value="downloadUrl" class="js-input-url" readonly />
        <button type="button" @click="copyToClipboard">Copy ID</button>
      </div>
    </div>
    <!-- 完了画面 -->
        <v-snackbar
        v-model="snackbar"
        >
        {{ text }}

        <template v-slot:action="{ attrs }">
            <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
            >
            Close
            </v-btn>
        </template>
        </v-snackbar>

    <v-dialog v-model="dialog" max-width="500px" >
        <v-card>
            <v-card-title>
            <span class="text-h5">Please complete the form</span>
            </v-card-title>
            <v-card-text>
            <v-container>
                <v-form
                    lazy-validation
                    ref="form"
                >
                <v-text-field
                v-model="name"
                :counter="20"
                :rules="nameRules"
                label="Name"
                required
                ></v-text-field>
                
                <v-text-field
                v-model="contactNumber"
                :rules="contactNumberRules"
                label="Contact Number"
                required
                ></v-text-field>

                <v-text-field
                v-model="companyName"
                :rules="companyNameRules"
                label="Company Name"
                required
                ></v-text-field>

                </v-form>
            </v-container>
            <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
            >
                Close
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="$refs.form.reset()"
            >
                Clear
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="nextStep"
            >
                Upload
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

  </div>
</template>

<script>
// import firebase from '@/plugins/firebase'
export default {
  data() {
    return {
      isDrag: false,
      isForm: true,
      isLoading: false,
      isFinish: false,
      downloadUrl: '',
      preview: null,
      file: null,
      snackbar: false,
      text: `This is not an image !`,
      name: '',
      nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters',
      ],
      contactNumber: '',
      contactNumberRules: [
          v => !!v || 'Contact number is required',
      ],
      companyName: '',
      companyNameRules: [
          v => !!v || 'Company name is required',
      ],
      dialog: false
    }
  },
  methods: {
    uploaded(photo) {
      // 選択されたファイルを取得
      const photoFile = photo.target.files[0]
      this.uploadFirebase(photoFile)
      
    },
    dragEnter() {
      this.isDrag = true
    },
    dragLeave() {
      this.isDrag = false
    },
    dropFile() {
      // TODO ファイル取得
      this.isDrag = false
      const photoFile = event.dataTransfer.files[0]
      this.uploadFirebase(photoFile)
    },
    async uploadFirebase(file) {
        this.isForm = false
        this.isLoading = true
        if(!file.type.startsWith('image/')) {
            this.isLoading = false
            this.isForm = true
            this.text = `This is not an image !`
            return this.snackbar = true
        }
        this.file = file;
        this.preview = URL.createObjectURL(file)
        this.isLoading = false
        this.isForm = true

    },
    prompDialog() {
        this.dialog = true
    },
    async nextStep() {
        if(!this.$refs.form.validate()) return;
        this.dialog = false
        await this.uploadMango()
    },
    async uploadMango() {
        this.isForm = false
        this.isLoading = true
        let formData = new FormData();

        formData.append('myImage', this.file)

        const res = await this.$axios.post(`/api/uploadPhoto?name=${this.name}&contactNumber=${this.contactNumber}&companyName=${this.companyName}`,formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })

        if(res.data.error == true) {
            this.text = `An unknown error occured. Please refresh this page and upload again !`
            this.snackbar = true
            this.isLoading = false
            this.isForm = true
            this.file = null
            this.preview = null
            return
        }

        this.isLoading = false
        this.isFinish = true
        this.downloadUrl = res.data.id;
    },
    copyToClipboard() {
      this.$copyText(this.downloadUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
.upload {
  &_form {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 402px;
    height: 469px;
    background: rgb(208, 205, 205);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    box-sizing: border-box;
    padding: 36px 3%;
    &_title {
      font-size: 1.8rem;
      font-weight: 500;
      line-height: 2.7rem;
      letter-spacing: -0.035em;
      color: #4f4f4f;
      text-align: center;
    }
    &_note {
      padding-top: 16px;
      font-weight: 500;
      font-size: 10px;
      line-height: 15px;
      text-align: center;
      letter-spacing: -0.035em;
      color: #828282;
    }
    &_main {
      padding-top: 30px;
      .-drop {
        padding: 36px 0 40px;
        background-color: #f6f8fb;
        border: 1px dashed #97bef4;
        box-sizing: border-box;
        border-radius: 12px;
        text-align: center;
        &.-active {
          border: 3px solid #97bef4;
        }
        .-text {
          padding-top: 37px;
          font-size: 1.2rem;
          line-height: 1.8rem;
          letter-spacing: -0.035em;
          color: #bdbdbd;
        }
      }
      .-text {
        padding-top: 18px;
        text-align: center;
        font-size: 1.2rem;
        line-height: 1.8rem;
        text-align: center;
        letter-spacing: -0.035em;
        color: #bdbdbd;
      }
      .-button {
        padding-top: 21px;
        text-align: center;
        .-label {
          display: inline-block;
          cursor: pointer;
          padding: 8px 16px;
          background: #2f80ed;
          border-radius: 8px;
          font-weight: 500;
          font-size: 1.2rem;
          line-height: 1.6rem;
          text-align: center;
          letter-spacing: -0.035em;
          color: #fff;
          &:hover {
            opacity: 0.7;
            transition: 0.3s;
          }
          input {
            display: none;
          }
        }
      }
    }
  }
  &_loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 400px;
    height: 143px;
    padding: 36px 27px 43px 32px;
    background: #fff;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    &_text {
      font-family: Poppins;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 27px;
      letter-spacing: -0.035em;
      color: #4f4f4f;
    }
    &_bar {
      margin-top: 30px;
      width: 100%;
      height: 6px;
      background: #f2f2f2;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      .-active {
        position: absolute;
        top: 0;
        left: 0;
        width: 30%;
        height: 6px;
        background: #2f80ed;
        border-radius: 8px;
        // before
        // animation: loading 2s 0.5s linear infinite;
        // after
        animation: {
          name: loading;
          duration: 2s; // かかる時間
          delay: 0.5s; // 何秒後に開始するか
          timing-function: linear; // 速度 linear : 一定
          iteration-count: infinite; // 無限ループ
        }
      }
    }
  }
  &_finish {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    padding: 40px 32px 33px;
    width: 400px;
    height: 454px;
    background: #fff;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    &_check {
      margin: auto;
      width: 35px;
      height: 35px;
      border-radius: 100%;
      background: #219653;
      position: relative;
      &::before,
      &::after {
        content: '';
        display: block;
        position: absolute;
        background-color: #fff;
        border-radius: 7px;
        height: 4px;
      }
      &::before {
        width: 30%;
        top: 55%;
        left: 17%;
        transform: rotate(43deg);
      }
      &::after {
        width: 60%;
        top: 47%;
        left: 28%;
        transform: rotate(-45deg);
      }
    }
    &_text {
      padding-top: 11px;
      font-family: Poppins;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 27px;
      text-align: center;
      letter-spacing: -0.035em;
      color: #4f4f4f;
    }
    &_img {
      padding-top: 25px;
      text-align: center;
      img {
        border-radius: 12px;
        height: 180px;
        object-fit: cover;
      }
    }
    &_urlWrap {
      margin-top: 25px;
      position: relative;
      input {
        pointer-events: none;
        padding-left: 7px;
        padding-right: 80px;
        width: 100%;
        height: 34px;
        background: #f6f8fb;
        border: 1px solid #e0e0e0;
        box-sizing: border-box;
        border-radius: 8px;
        font-family: Poppins;
        font-style: normal;
        font-weight: 500;
        font-size: 8px;
        line-height: 12px;
        letter-spacing: -0.035em;
        color: #4f4f4f;
      }
      button {
        cursor: pointer;
        position: absolute;
        width: 74px;
        height: 30px;
        top: 2px;
        right: 2px;
        background: #2f80ed;
        border: none;
        border-radius: 8px;
        transition: 0.3s;
        &:hover {
          opacity: 0.7;
        }
        font: {
          family: Poppins;
          weight: 500;
          size: 8px;
        }
        line-height: 12px;
        text-align: center;
        letter-spacing: -0.035em;
        color: #fff;
      }
    }
  }
}
@keyframes loading {
  from {
    left: -100%;
  }
  to {
    left: 100%;
  }
}
</style>