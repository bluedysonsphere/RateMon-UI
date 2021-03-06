<template>
  <v-app>
    <div>
      <v-app-bar color="deep-blue accent-4" dense dark flat>
        <v-toolbar-title><b> CMS</b> <i> Rate Monitoring</i> UI</v-toolbar-title>
        <v-spacer></v-spacer>
        <div>
          <v-btn color="white" text x-large @click.stop="dialog = true">
            {{ selectedTriggers.length }} Trigger<span v-if="selectedTriggers.length!=1">s</span>
          </v-btn>
          &nbsp;RUN:
          <v-btn color="white" text>
            <v-autocomplete @change="drawPlots" v-model="selectedRun" small :items="availableRuns"></v-autocomplete>
          </v-btn>
        </div>
        <v-menu left bottom>
        </v-menu>
      </v-app-bar>
    </div>
    <v-content>
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <div class="text-center">
              <!--<v-pagination color="deep-purple accent-4" @input="plotRates" v-model="selectedPage" :length="totalPages"></v-pagination>-->
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-banner v-if="ignoredPlots.length>0">
              <v-icon slot="icon" color="warning" size="32">
                mdi-alert-box-outline
              </v-icon>
              Warning: trigger with no data: {{ignoredPlots}}
            </v-banner>
          </v-col>
        </v-row>
        <v-row>
          <template v-for="(trigger, index) in selectedTriggers" class="pa-2">
            <div ref="drawing" :key="index" style="width:800px; height:600px"></div>
          </template>
        </v-row>
      </v-container>
    </v-content>
    <v-dialog v-model="dialog" max-width="75%">
      <v-card>
        <v-card-title class="headline">Trigger Keys selection</v-card-title>
        <v-card-text>
          <v-treeview v-model="selectedTriggers" selectable :items="availableTriggerKeys"></v-treeview>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="drawPlots">
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-footer fixed> JSROOT - API: <a target="_blank" :href="apiEndpoint + 'ui'"> {{ apiEndpoint }}</a> - commithash:
      <pre>{{commitHash}}</pre> - feedback: <a href="https://gitlab.cern.ch/avivace/ratemon-ui">gitlab.cern.ch/avivace/ratemon-ui</a></v-footer>
  </v-app>
</template>
<script>
export default {
  name: 'Rates',
  data: () => ({
    selectedPage: 1,
    ignoredPlots: [],
    plotsToDraw: [],
    currentPage: 0,
    plotsPerPage: 4,
    totalPages: 0,
    commitHash: process.env.VUE_APP_GIT_HASH,
    apiEndpoint: 'http://brandeis.cern.ch:8085/api/v1/',
    availableRuns: [325172, 325170, 325169, 325159, 325117, 325057, 305112, 315257, 315259, 315264],
    selectedRun: null,
    selectedTriggers: ["HLT_CaloJet500_NoJetID", "HLT_PFJet450", "HLT_AK8PFJet200", "HLT_Photon60_R9Id90_CaloIdL_IsoL_DisplacedIdL_PFHT350MinPFJet15", "L1_SingleEG26er2p5", "L1_SingleTau120er2p1"],
    dialog: false,
    plots: [],
    availableTriggerKeys: [{
        id: 0,
        name: 'L1',
        children: [, { id: 'L1_DoubleMu_12_5', name: 'L1_DoubleMu_12_5' }, { id: 'L1_SingleTau120er2p1', name: 'L1_SingleTau120er2p1' }, { id: 'L1_SingleJet120', name: 'L1_SingleJet120' }, { id: 'L1_SingleMu22', name: 'L1_SingleMu22' }, { id: 'L1_SingleMu22_EMTF', name: 'L1_SingleMu22_EMTF' }, { id: 'L1_SingleMu16er1p5', name: 'L1_SingleMu16er1p5' }, { id: 'L1_DoubleTau70er2p1', name: 'L1_DoubleTau70er2p1' }, { id: 'L1_SingleEG26er2p5', name: 'L1_SingleEG26er2p5' }, { id: 'L1_SingleEG40er2p5', name: 'L1_SingleEG40er2p5' }, { id: 'L1_SingleIsoEG28er2p5', name: 'L1_SingleIsoEG28er2p5' }, { id: 'L1_DoubleEG_25_12_er2p5', name: 'L1_DoubleEG_25_12_er2p5' }, { id: 'L1_TripleJet_95_75_65_DoubleJet_75_65_er2p5', name: 'L1_TripleJet_95_75_65_DoubleJet_75_65_er2p5' }],
      },
      {
        id: 1,
        name: 'HLT',
        children: [
          { id: 'HLT_Ele40_WPTight_Gsf', name: 'HLT_Ele40_WPTight_Gsf' }, { id: 'HLT_DoubleEle33_CaloIdL_MW', name: 'HLT_DoubleEle33_CaloIdL_MW' }, { id: 'HLT_Ele23_Ele12_CaloIdL_TrackIdL_IsoVL_DZ', name: 'HLT_Ele23_Ele12_CaloIdL_TrackIdL_IsoVL_DZ' }, { id: 'HLT_IsoMu27', name: 'HLT_IsoMu27' }, { id: 'HLT_Mu17_TrkIsoVVL_Mu8_TrkIsoVVL_DZ', name: 'HLT_Mu17_TrkIsoVVL_Mu8_TrkIsoVVL_DZ' }, { id: 'HLT_Mu23_TrkIsoVVL_Ele12_CaloIdL_TrackIdL_IsoVL', name: 'HLT_Mu23_TrkIsoVVL_Ele12_CaloIdL_TrackIdL_IsoVL' }, { id: 'HLT_Mu23_TrkIsoVVL_Ele12_CaloIdL_TrackIdL_IsoVL_DZ', name: 'HLT_Mu23_TrkIsoVVL_Ele12_CaloIdL_TrackIdL_IsoVL_DZ' }, { id: 'HLT_DoubleMediumChargedIsoPFTau35_Trk1_eta2p1_Reg', name: 'HLT_DoubleMediumChargedIsoPFTau35_Trk1_eta2p1_Reg' }, { id: 'HLT_Photon200', name: 'HLT_Photon200' }, { id: 'HLT_Photon60_R9Id90_CaloIdL_IsoL_DisplacedIdL_PFHT350MinPFJet15', name: 'HLT_Photon60_R9Id90_CaloIdL_IsoL_DisplacedIdL_PFHT350MinPFJet15' }, { id: 'HLT_DoublePhoton70', name: 'HLT_DoublePhoton70' }, { id: 'HLT_AK8PFJet200', name: 'HLT_AK8PFJet200' }, { id: 'HLT_CaloJet500_NoJetID', name: 'HLT_CaloJet500_NoJetID' }, { id: 'HLT_PFJet450', name: 'HLT_PFJet450' }, { id: 'HLT_HT300PT30_QuadJet_75_60_45_40_TripeCSV_p07', name: 'HLT_HT300PT30_QuadJet_75_60_45_40_TripeCSV_p07' }, { id: 'HLT_PFHT430', name: 'HLT_PFHT430' }, { id: 'HLT_PFMET110_PFMHT110_IDTight', name: 'HLT_PFMET110_PFMHT110_IDTight' }
        ],

      }
    ],
    data: [{
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: "scattergl",
      mode: "markers"
    }],
    layout: {
      title: "My graph"
    }
  }),

  methods: {
    plotRates: function() {
      console.log("Updating pagination and rendering page")
      this.totalPages = parseInt(this.plots.length / this.plotsPerPage) + ((this.plots.length % this.plotsPerPage > 0) ? 1 : 0)
      this.plotsToDraw = this.plots.slice((this.selectedPage - 1) * this.plotsPerPage, this.selectedPage * this.plotsPerPage)
      console.log(this.plotsToDraw)
    },
    plotTrigger: function(var_X, var_Y, trigger, runNumber, targetDiv) {

      // Reconstruct the object name given by RateMon's PlotMaker class
      let objectName = `${trigger}_${var_X}_vs_${var_Y};1`
      // Build the GET call to the API
      let endpoint = `${this.apiEndpoint}ratesROOT?runNumber=${runNumber}&triggerKey=${trigger}`

      console.log("Calling", endpoint)
      // Draw the plot in the requested Div
      new JSROOT.TFile(endpoint, function(file) {
        file.ReadObject(objectName, function(obj) {
          JSROOT.draw(targetDiv, obj);
        });
      });
    },
    drawPlots: function() {
      console.log(this.selectedTriggers)
      // Use deconstructing to unpack entries()
      for (let [index, trigger] of this.selectedTriggers.entries()) {

        let divname = 'drawing' + trigger
        console.log(divname)
        // when ref is used on elements/components with v-for, the registered reference will be an Array containing DOM nodes or component instances.
        let targedDiv = this.$refs["drawing"][index]
        this.plotTrigger("< PU >", "pre-deadtime unprescaled rate", trigger, this.selectedRun, targedDiv)
      }

    },
  },
  mounted: function() {
    // Autoselects the first run
    this.selectedRun = this.availableRuns[0]
    // Initial drawing
    this.drawPlots()
  },
};

</script>
