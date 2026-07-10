import mongoose from 'mongoose';
const mongodbUrl = 'mongodb://pushprajcdy16_db_user:pushpastack@ac-i5fqxdq-shard-00-00.rzhrrna.mongodb.net:27017,ac-i5fqxdq-shard-00-01.rzhrrna.mongodb.net:27017,ac-i5fqxdq-shard-00-02.rzhrrna.mongodb.net:27017/?ssl=true&replicaSet=atlas-pp3qa1-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(mongodbUrl).then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({ email: String }));
  const Token = mongoose.model('Token', new mongoose.Schema({ token: String, user: mongoose.Schema.Types.ObjectId, type: String }));
  
  const user = await User.findOne({ email: 'demo@example.com' });
  if (!user) {
    console.log('Demo user not found');
    process.exit(0);
  }
  const tokenDoc = await Token.findOne({ user: user._id, type: 'resetPassword' }).sort({ createdAt: -1 });
  if (tokenDoc) {
    console.log('RESET_TOKEN:' + tokenDoc.token);
  } else {
    console.log('No reset token found');
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
