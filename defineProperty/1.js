var userInfo = {};
Object.defineProperty(userInfo, "nickName", {
    get: function(){
        return document.getElementById('nickName').innerHTML;
    },
    set: function(nick){
        document.getElementById('nickName').innerHTML = nick;
    }
});
Object.defineProperty(userInfo, "introduce", {
    get: function(){
        return document.getElementById('introduce').innerHTML;
    },
    set: function(introduce){
        document.getElementById('introduce').innerHTML = introduce;
    }
});

userInfo.nickName = "hi";
userInfo.introduce = "vchat";

let Input = document.getElementById('input');
Input.onchange = function() {
    console.log(11111111);
    userInfo.introduce = Input.value;
};