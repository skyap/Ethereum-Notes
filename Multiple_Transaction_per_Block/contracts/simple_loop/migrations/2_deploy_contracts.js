var loop = artifacts.require("loop");


module.exports = async function(deployer){
    await deployer.deploy(loop);
}