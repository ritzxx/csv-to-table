import React, { useState } from 'react';
import axios from 'axios';
import {
    Layout,
    Typography,
    Button,
    Input,
    Upload,
    message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DataTable from './components/Table';
import CustomPagination from './components/Pagination';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    const handleUpload = async (file) => {
        const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
        if (!isCSV) {
            message.error('You can only upload CSV files!');
            return false; // Prevent upload
        }

        const formData = new FormData();
        formData.append('file', file);
        try {
            await axios.post('http://localhost:5000/upload', formData);
            fetchData();
            message.success("File uploaded successfully!");
        } catch (error) {
            message.error("File upload failed!");
        }
        return false; // Prevent default upload behavior
    };

    const fetchData = async () => {
        const response = await axios.get('http://localhost:5000/data');
        setData(response.data);
    };

    const handleSearch = async (event) => {
        if (event.key === 'Enter') {
            const response = await axios.get(`http://localhost:5000/search?q=${searchQuery}`);
            setData(response.data);
            setPage(1); // Reset to the first page when searching
        }
    };

    // Calculate displayed data based on current page and rows per page
    const displayedData = Array.isArray(data) ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage) : [];

    const columns = data.length > 0 ? Object.keys(data[0]).map(key => ({
        title: key,
        dataIndex: key,
        key: key,
    })) : [];

    return (
        <Layout>
            <Header style={{ color: 'white' }}>
                <Title style={{ color: 'white', margin: 0 }}>CSV Upload and Table Display</Title>
            </Header>
            <Content style={{ padding: '20px' }}>
                <Upload
                    beforeUpload={handleUpload}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />}>Upload CSV</Button>
                </Upload>
                <Input 
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    style={{ margin: '20px 0', width: '300px' }}
                />
                <DataTable displayedData={displayedData} columns={columns} />
                <CustomPagination
                    current={page}
                    pageSize={rowsPerPage}
                    total={data.length}
                    onPageChange={(page, pageSize) => {
                        setRowsPerPage(pageSize);
                        setPage(page);
                    }}
                />
            </Content>
        </Layout>
    );
}

export default App;
