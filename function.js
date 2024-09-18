function isDuplicate(entry) {
    console.log('開始檢查重複')
    const key = `${entry.Father}-${entry.Mother}-${entry.self_name}`;
    const spouseKey = `${entry.Father}-${entry.Mother}-${entry.spouse}`;
    const ID = `${entry.Father}-${entry.Mother}-${entry.PID}`;
    if (seenEntries[key] && !seenEntries[spouseKey]) {
        // 爸媽自己節點一樣
        console.log('配偶不同的记录:', key);
        const existingIndex = nodes.findIndex(node =>
            node.n === entry.self_name &&
            (node.f && node.f === nameToPID[entry.Father]) &&
            (node.m && node.m === nameToPID[entry.Mother])
        );
        if (!nameToPID[entry.spouse]) {
            SpouseNamePID = createNode(entry.spouse, '', '', nameToPID[entry.self_name], '', '');
        } else {
            SpouseNamePID = nameToPID[entry.spouse]
        }
        const existingNode = nodes[existingIndex];
        if (existingNode && SpouseNamePID) {
            if (!existingNode.ux.includes(SpouseNamePID)) {
                existingNode.ux.push(SpouseNamePID);
            }
            existingNode.key = existingIndex + 1;
            nodes[existingIndex] = existingNode;
            nameToPID[entry.self_name] = existingIndex + 1;
            return false;
        }

    } else if (nameToPID[entry.self_name] && !seenEntries[spouseKey]) {
        // 名字完全一樣,已經建立過這節點，只是要更新名字節點的資訊 配偶不同 沒有建立過PID
        console.log('名字相同的紀錄,配偶不同:', entry.self_name);
        const existingIndex = nodes.findIndex(node =>
            node.n === entry.self_name
        );
        const existingNode = nodes[existingIndex];
        if (existingNode) {
            existingNode.f = nameToPID[entry.Father];
            existingNode.m = nameToPID[entry.Mother];
            if (!existingNode.ux.includes(nameToPID[entry.spouse])) {
                existingNode.ux.push(nameToPID[entry.spouse]);
            }
            nameToPID[entry.self_name] = existingIndex + 1;
            nodes[existingIndex] = existingNode;
            nameToPID[existingNode.n] = nameToPID[entry.self_name]
        }
        if (seenEntries[ID]) {
            console.log('名字不同的紀錄,兩個名字,但是爸媽不同:', spouseKey, entry.self_name, entry.PID);
            const existingIndex = nodes.findIndex(node =>
                node.pid === entry.PID &&
                node.n != entry.self_name
            );
            const existingNode = nodes[existingIndex];
            if (existingIndex != -1) {
                nodes = UpdateParent(nodes, existingNode, nameToPID, entry)
            }
        }


    } else if (seenEntries[spouseKey] || seenEntries[ID] && entry.spouse !== "") {
        // 情况3：父、母、配偶相同，名字不同
        console.log('名字不同的紀錄情況3,：父、母、配偶相同，名字不同:', spouseKey, entry.self_name);
        const existingIndex = nodes.findIndex(node =>
            node.f === nameToPID[entry.Father] &&
            node.m === nameToPID[entry.Mother] &&
            node.pid.includes(entry.PID)
        );
        const existingNode = nodes[existingIndex];
        if (existingNode) {
            existingNode.n = entry.self_name;
            nameToPID[entry.self_name] = existingIndex + 1;
            nodes[existingIndex] = existingNode;

            if (seenEntries[ID]) {
                console.log('名字不同的紀錄,兩個名字,但是爸媽不同:', spouseKey, entry.self_name, entry.PID);
                const existingIndex = nodes.findIndex(node =>
                    node.pid === entry.PID &&
                    node.n !== entry.self_name
                );
                const existingNode = nodes[existingIndex];
                if (existingIndex != -1) {
                    nodes = UpdateParent(nodes, existingNode, nameToPID, entry)
                }

                // 幫忙檢查 父母節點有沒有連結
                const FatherName = nodes.findIndex(node =>
                    node.key === nameToPID[entry.Father]
                );
                const MotherName = nodes.findIndex(node =>
                    node.key === nameToPID[entry.Mother]
                );
                // TODO :這裡要修
                if (nodes[FatherName] && nodes[MotherName]) {
                    if (!nodes[FatherName].ux.includes(nodes[MotherName].key)) {
                        console.log('新增爸爸媽媽節點', nodes[FatherName])
                        nodes[FatherName].ux.push(nodes[MotherName].key)
                    }


                    if (!nodes[MotherName].ux.includes(nodes[FatherName].key)) {
                        console.log('新增爸爸媽媽節點', nodes[FatherName])
                        nodes[MotherName].ux.push(nodes[FatherName].key)
                    }
                }

                return false
            }
        } else {
            console.log('没有重复的记录');
            seenEntries[key] = entry.spouse;
            seenEntries[spouseKey] = entry.self_name;
            seenEntries[ID] = entry.PID;
            return false;
        }
    }
}