export default {
    state: {
       heightNum:396,
	   orderList:[],
	   orderDate:"",
	   orderTime:"",
	   orderRefresh:0
	   // recordList:[]
	   
       
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
	   }
	   // setRecordList(state,n){
	   // 		   state.recordList = n;
	   // }
    }
}