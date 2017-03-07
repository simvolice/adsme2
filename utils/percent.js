/**
 * Created by simvolice on 07.03.2017 19:36
 */





module.exports = {


     percentage: function(num, per){





             let tempResult = (num / 100) * per;



             let result = tempResult + parseInt(num);



             return result.toFixed(2);








     }



};