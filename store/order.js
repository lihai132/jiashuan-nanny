export default {
    state: {
       heightNum:390,
	   orderList:[],
	   orderDate:"",
	   orderTime:"",
	   orderRefresh:0,
	   yearMonth:"",
	   change:false
	   
       
    },
    mutations: {
       setHeight(state,n){
		   state.heightNum = n;
	   },
	   setOrderList(state,n){
	   		   state.orderList = n;
	   },
	   setOrderDate(state,n){
	   		   state.orderDate = n;
	   },
	   setOrderTime(state,n){
	   		   state.orderTime = n;
	   },
	   setYear(state,n){
		   state.yearMonth = n;
	   },
	   setChange(state,n){
	   		   state.change = n;
	   }
	   
    }
}