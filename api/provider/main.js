const modules = {
    firestore: require('./firestore'),
}

for(const module of Object.values(modules)){
    Object.keys(module).forEach(key => {
        if (key !== 'default' && key !== '__esModule') {
            exports[key] = module[key];
        }
    });
}
