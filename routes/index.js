var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

router.get('/', function(req, res) {
  res.render('index', { community: config.community });
});

router.post('/invite', function(req, res) {
  if (req.body.email) {
    request.post({
        url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
        form: {
          email: req.body.email,
          first_name:req.body.first_name,
          last_name:req.body.last_name,
          token: config.slacktoken,
          set_active: true
        }
      }, function(err, httpResponse, body) {
        // body looks like:
        //   {"ok":true}
        //       or
        //   {"ok":false,"error":"already_invited"}
        if (err) { return res.send('Error:' + err); }
        body = JSON.parse(body);
        if (body.ok) {
          res.send('ユーザー情報を送信しました！<br/>もうしばらくすると "'+ req.body.email +'" 宛に Slack から招待メールが届きます。メールの案内にしたがって参加登録をしましょう。');
        } else {
          res.send('エラー！戻ってもう一度参加登録をしてください。 ' + body.error)
        }
      });
  } else {
    res.status(400).send('メールアドレスは必須です');
  }
});

module.exports = router;
