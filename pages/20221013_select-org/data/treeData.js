var treeDataList = [
    {
        children: [
            {
                children: [
                    {
                        children: null,
                        organId: "1100",
                        parentId: "1000",
                        parentIds: ['0000', '1000'],
                        organName: "部门1-1",
                        organType: "DEPT",

                    }
                ],
                organId: "1000",
                parentId: "0000",
                parentIds: ['0000'],
                organName: "部门1",
                organType: "DEPT",

            },
            {
                children: [
                    {
                        children: null,
                        organId: "2100",
                        parentId: "2000",
                        parentIds: ['0000', '2000'],
                        organName: "部门2-1",
                        organType: "DEPT",

                    },
                    {
                        children: null,
                        organId: "2200",
                        parentId: "2000",
                        parentIds: ['0000', '2000'],
                        organName: "部门2-2",
                        organType: "DEPT",

                    }
                ],
                organId: "2000",
                parentId: "0000",
                parentIds: ['0000'],
                organName: "部门2",
                organType: "DEPT",

            },
            {
                children: [
                    {
                        children: [
                            {
                                children: null,
                                organId: "3110",
                                parentId: "3100",
                                parentIds: ['0000', '3000', '3100'],
                                organName: "部门3-1-1",
                                organType: "DEPT",

                            },
                            {
                                children: null,
                                organId: "3120",
                                parentId: "3100",
                                parentIds: ['0000', '3000', '3100'],
                                organName: "部门3-1-2",
                                organType: "DEPT",

                            }
                        ],
                        organId: "3100",
                        parentId: "3000",
                        parentIds: ['0000', '3000'],
                        organName: "部门3-1",
                        organType: "DEPT",

                    },
                    {
                        children: null,
                        organId: "3200",
                        parentId: "3000",
                        parentIds: ['0000', '3000'],
                        organName: "部门3-2",
                        organType: "DEPT",

                    }
                ],
                organId: "3000",
                parentId: "0000",
                parentIds: ['0000'],
                organName: "部门3",
                organType: "DEPT",

            }
        ],
        organId: "0000",
        parentId: "-1",
        parentIds: [],
        organName: "测试数据",
        organType: "COMPANY",

    }
]

export default treeDataList;