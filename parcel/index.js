window.onload = function() {
    const appRoot = document.querySelector('#app');
    setTimeout(() => {
        appRoot.innerHTML = 'Parcel 打包成功！';
    }, 1500);
};