import { Component } from 'react';
import { Input, Table, Button, Center, Space, Pagination } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import axios from 'axios';
import moment from 'moment';
import { usePromiseTracker, trackPromise } from 'react-promise-tracker';
import { Map } from 'mapbox-gl';



class SignalsPanel extends Component<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            signals: [],
            selectedSignal: null,
            fetchNextUri: null,
        }
    }
    
    async fetchSignalsFromRW(query: string) {
        return axios.get("https://api.resourcewatch.org/v1/dataset?search=" + query).then(function (res) {
            console.log(res.data);
            return { data: res.data.data, pages: res.data.meta['total-pages'], total: res.data.meta['total-items']} ;
        }).catch(function (error) {
            return {};
        });
    }

    render() {
        return (
            <>
                <Input
                    icon={<Search />}
                    placeholder="Start typing here..."
                    radius="md"
                    onChange={async (e:any) => {
                        this.setState({signals : []});
                        var res = await this.fetchSignalsFromRW(e.target.value);
                        //this.setState({signals : this.state.signals.concat(res.data)});
                    }}
                />
                <Table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Last updated</th>
                        </tr>
                    </thead>
                    <tbody>{this.state.signals?.map((e: any) => (<tr key={e.id}><td>{e.attributes.type}</td><td>{e.attributes.name}</td><td>{moment(e.attributes.updatedAt).fromNow()}</td></tr>))}</tbody>
                </Table>
                <Space h="sm" />
                <Center>
                    <Pagination total={10} />
                </Center>
            </>
        );
    }
}

export default SignalsPanel;