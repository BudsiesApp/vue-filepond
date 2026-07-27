import VueFilePond, { VueFilePondComponent } from "vue-filepond";
import Vue from "vue"

const SomePlugin = {}
const OtherPlugin = {}

const Filepond = VueFilePond(SomePlugin, OtherPlugin)

Vue.component('Filepond', Filepond)

const component = Vue.extend({
  components: {
    Filepond
  },
  methods: {
    init() {
      const pond = this.$refs.filepond as VueFilePondComponent
      pond.addFile('file')
      pond.addFiles(['file'])
      pond.browse()
      pond.getFile('file')
      pond.getFiles()
      pond.moveFile('file', 0)
      pond.prepareFile('file')
      pond.prepareFiles('first', 'second')
      pond.processFile('file')
      pond.processFiles(['file'])
      pond.removeFile('file')
      pond.removeFiles()
      pond.sort(() => 0)
    }
  }
})

type HasKey<Type, Key extends string> = Key extends keyof Type ? true : false

const doesNotExposeSetOptions: HasKey<VueFilePondComponent, 'setOptions'> = false
const doesNotExposeServer: HasKey<VueFilePondComponent, 'server'> = false
const doesNotExposeStatus: HasKey<VueFilePondComponent, 'status'> = false
