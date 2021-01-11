import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);
import login from './login';
import order from './order';
import meet from './meet';


export default new vuex.Store({
    modules: {
        login,
		order,
		meet
		



    }

})

// const store = new Vuex.Store({
// 	state: {
// 		name: "李海"
// 	},
// 	mutations: {},
// 	actions: {}
// })
// export default store
