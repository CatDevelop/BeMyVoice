import {useSelector} from 'react-redux';

export function useDirectories() {
    let local = useSelector((state) => state.local);

    return {
        filesDir: local.filesDir,
        selectElement: local.selectElement,
        directories: {...local.directories, title: "Локальное хранилище"},
        selectFolderKey: local.selectFolderKey,
        selectFolderPath: local.selectFolderPath,
        selectFilePath: local.selectFilePath,
        filesFolderDir: local.filesFolderDir,
        selection: local.selection
    };
}
