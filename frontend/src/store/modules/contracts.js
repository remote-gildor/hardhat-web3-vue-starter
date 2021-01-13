import Calc from "../../contracts/Calc.json";
import addresses from "../../contracts/addresses.json";

const state = {
  num: 0,
  calcAbi: null,
  calcAddress: null,
  calcContract: null
};

const getters = {
  getNum(state) {
    return state.num;
  },
  getCalcAbi(state) {
    return state.calcAbi;
  },
  getCalcAddress(state) {
    return state.calcAddress;
  },
  getCalcContract(state) {
    return state.calcContract;
  }
};

const actions = {
  async fetchCalcContract({ commit, rootState }) {
    let web3 = rootState.accounts.web3;
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let calcAddress = addresses.Calc[chainIdDec];

    let contract = new web3.eth.Contract(Calc.abi, calcAddress);
    commit("setCalcContract", contract);
  },
  async fetchNum({ commit, state }) {
    if (!state.calcContract) {
      this.fetchCalcContract();
    }

    let num = await state.calcContract.methods.getNum().call();

    commit("setNum", num);
  },
  storeCalcAbi({commit}) {
    commit("setCalcAbi", Calc.abi);
  },
  storeCalcAddress({ commit, rootState }) {
    let chainIdDec = parseInt(rootState.accounts.chainId);
    let calcAddress = addresses.Calc[chainIdDec];

    commit("setCalcAddress", calcAddress);
  }
};

const mutations = {
  setNum(state, _num) {
    state.num = _num;
  },
  setCalcAbi(state, abi) {
    state.calcAbi = abi;
  },
  setCalcAddress(state, address) {
    state.calcAddress = address;
  },
  setCalcContract(state, _contract) {
    state.calcContract = _contract;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
