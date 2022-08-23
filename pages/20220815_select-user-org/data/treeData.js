var treeDataList = [
    {
        children: [
            {
                children: [
                    {
                        children: null,
                        organId: "478bf992dfc6ad33d202e16793fcbff8",
                        parentId: "fa4b0c12a1b1fb759aadc27880f5ebae",
                        organName: "部门1-1",
                        organType: "DEPT",
                        organLevel: 3,
                        organSort: 0,
                        userNumber: "0",
                        userList: null
                    }
                ],
                organId: "fa4b0c12a1b1fb759aadc27880f5ebae",
                parentId: "241e7066b90fd9220102fd36f1771df7",
                organName: "部门1",
                organType: "DEPT",
                organLevel: 2,
                organSort: 0,
                userNumber: "0",
                userList: [
                    {
                        accountId: "111122",
                        check: false,
                        isMain: false,
                        isSub: false,
                        organNames: [],
                        prefix: "1",
                        userIcon: "",
                        userId: "111",
                        userMobilePhone: "15542419308",
                        userName: "部门1155张",
                    },
                    {
                        accountId: "112222",
                        check: false,
                        isMain: false,
                        isSub: false,
                        organNames: [],
                        prefix: "1",
                        userIcon: "",
                        userId: "2222",
                        userMobilePhone: "15542419308",
                        userName: "部门1155张2",
                    }
                ]
            },
            {
                children: [
                    {
                        children: null,
                        organId: "9b55ad600cc01cdc5db94bf8e9b310d7",
                        parentId: "47f9460516e6de390f2758f3e3c807bf",
                        organName: "部门2-1",
                        organType: "DEPT",
                        organLevel: 3,
                        organSort: 0,
                        userNumber: "0",
                        userList: null
                    },
                    {
                        children: null,
                        organId: "994e1df382b7ef7144bcad43d6ced4d2",
                        parentId: "47f9460516e6de390f2758f3e3c807bf",
                        organName: "部门2-2",
                        organType: "DEPT",
                        organLevel: 3,
                        organSort: 1,
                        userNumber: "0",
                        userList: null
                    }
                ],
                organId: "47f9460516e6de390f2758f3e3c807bf",
                parentId: "241e7066b90fd9220102fd36f1771df7",
                organName: "部门2",
                organType: "DEPT",
                organLevel: 2,
                organSort: 1,
                userNumber: "0",
                userList: null
            }
        ],
        organId: "241e7066b90fd9220102fd36f1771df7",
        parentId: "-1",
        organName: "测试数据公司",
        organType: "COMPANY",
        organLevel: 1,
        organSort: 0,
        userNumber: "1",
        userList: [
            {
                accountId: "1111",
                check: false,
                isMain: false,
                isSub: true,
                organNames: [],
                prefix: "1",
                userIcon: "",
                userId: "111",
                userMobilePhone: "15542419308",
                userName: "测试数据公司155张",
            },
            {
                accountId: "2222",
                check: false,
                isMain: true,
                isSub: false,
                organNames: [],
                prefix: "1",
                userIcon: "",
                userId: "2222",
                userMobilePhone: "15542419308",
                userName: "测试数据公司155张2",
            }
        ]
    }
]

export default treeDataList;