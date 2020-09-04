import { Avatar, List,Tabs } from 'antd';
import React from 'react';
import styles from'./NoticeList.less';
import {uTCToDate} from "@/utils/common";
import {history} from 'umi';
const { TabPane } = Tabs;
class NoticeList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data:this.props.data
        }

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data !== prevState.data) {
            return {
                data: nextProps.data,
            };
        }
        return null;
    }
    clearMsg=()=>{
        let arr = [];
        for(let item of this.tz){
            arr.push(item.id);
        }
        this.props.clearMsg(arr);
    }
    clearDb=()=>{
        let arr = [];
        for(let item of this.db){
            arr.push(item.id);
        }
        this.props.clearDb(arr);
    }

    toPage=(item)=>{
        const {module,unodoId,sonType} = item;
        switch (sonType) {
            case '自评':   //需要自评
                history.push(`/shengju/nk/pingjialist/${module}/sendZP`);
                break;
            case '复评':   // 需要复评
                history.push(`/shengju/nk/pingjialist/${module}/approvezp/${unodoId}`);
                break;
            case '样表':   // 评价样表审核
                history.push(`/shengju/nk/tableapprovechange/${module}/${unodoId}`);
                break;
            default:  //null   流程审核
                if(module==='预算'){
                    history.push(`/shengju/nk/tableapprove/${unodoId}/${module}`);
                }else if(module === '合同'){
                    history.push(`/shengju/nk/hetong/listapprove/${unodoId}`);

                }else if(module === '采购'){
                    history.push(`/shengju/nk/listapprove/${unodoId}`);

                }else if(module === '资产'){
                    history.push(`/shengju/nk/listapprove/${unodoId}`);
                }

                break;
        }

    }

    render(){
        const {data} = this.state;
        this.tz = [];
        this.db = [];
        for(let item of data){
            item.type === '通知' ? this.tz.push(item) : this.db.push(item);
        }
        return (
            <div className='popover'>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="通知" key="1">
                        <List className={styles.list}
                            dataSource={this.tz}
                            renderItem={(item, i) => {

                                return (
                                    <List.Item
                                        className={styles.item}
                                        key={item.key || i}
                                    >
                                        <List.Item.Meta
                                            className={styles.meta}
                                            avatar={
                                                <Avatar className={styles.avatar} size={'large'} style={{verticalAlign: 'middle',backgroundColor:'#606D80'}} >
                                                    {item.module}
                                                </Avatar>
                                            }
                                            title={
                                                <div className={styles.title}>
                                                    {item.title}
                                                    <div className={styles.extra}>{item.extra}</div>
                                                </div>
                                            }
                                            description={
                                                <div>
                                                    <div className={styles.description}>{item.note}</div>
                                                    <div className={styles.datetime}>{uTCToDate(item.createTime)}</div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                    );
                                }}
                            />
                        {this.tz.length > 0 ? <div className={styles.bottomBar}>
                                <div onClick={this.clearMsg}>
                                    清空
                                </div>

                            </div> : null}
                    </TabPane>
                    <TabPane tab="待办" key="3">
                        <List className={styles.list}
                              dataSource={this.db}
                              renderItem={(item, i) => {
                                  return (
                                      <List.Item
                                          className={styles.item}
                                          key={item.key || i}
                                          onClick={()=>{this.toPage(item)}}
                                      >
                                          <List.Item.Meta
                                              className={styles.meta}
                                              avatar={<Avatar className={styles.avatar} size={'large'} style={{verticalAlign: 'middle',backgroundColor:'#606D80'}} >
                                                  {item.module}
                                              </Avatar>}
                                              title={
                                                  <div className={styles.title}>
                                                      {item.title}
                                                      <div className={styles.extra}>{item.extra}</div>
                                                  </div>
                                              }
                                              description={
                                                  <div>
                                                      <div className={styles.description}>{item.note}</div>
                                                      <div className={styles.datetime}>{uTCToDate(item.createTime)}</div>
                                                  </div>
                                              }
                                          />
                                      </List.Item>
                                  );
                              }}
                        />
                        {this.db.length > 0 ? <div className={styles.bottomBar}>
                            <div onClick={this.clearDb}>
                                清空
                            </div>
                        </div> : null}
                    </TabPane>
                </Tabs>
            </div>
        )
    }

}


export default NoticeList;
