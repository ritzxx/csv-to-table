// DataTable.jsx
import React from 'react';
import { Table } from 'antd';

const DataTable = ({ displayedData, columns }) => {
    return (
        <Table
            dataSource={displayedData}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => index} // Unique key for each row
        />
    );
};

export default DataTable;
