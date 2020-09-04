import React from 'react';
import PropTypes from 'prop-types';
import {get,CancelAxiosRequest} from "@/utils/http";

let AuthComponent = ComposedCompnent => class WrapComponent extends React.Component{
    constructor(props){
        super(props);
        // window.permissions = ['add'];
        this.state={
            isShow:window.permissions && window.permissions.indexOf(this.props.auth)>-1,
        }
    }
    static propTypes = {
        auth:PropTypes.string.isRequired,
    }
    getBtn=()=>{
        get('position-authorities/getProAuthoritiesByUsr').then(res=>{
            window.permissions=res.data ? res.data:[];
            this.setState({isShow:window.permissions && window.permissions.indexOf(this.props.auth)>-1,})
        })
    }
    componentDidMount(){
        if(!window.permissions) {
            //get permission
            this.getBtn();
        }
    }
    componentWillUnmount(){
        if(CancelAxiosRequest)
            CancelAxiosRequest();
        this.setState = (state,callback)=>{
            return;
        };
    }
    render(){
        return this.state.isShow ? <ComposedCompnent {...this.props} /> : null;
         // return <ComposedCompnent {...this.props} />;
    }

}
export default AuthComponent;
