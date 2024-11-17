const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const LocalStrategy = require('passport-local').Strategy;

const prisma = new PrismaClient();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'teamspace_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newName = name || email;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: newName,
      },
    });

    res.status(201).redirect('/admin/');
  } catch (error) {
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

app.post('/api/create-channel', async (req, res) => {
  const { name, desc} = req.body;
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/login');
  }
  if (req.user.role == "admin") {
    try {
      await prisma.channel.create({
        data: {
          name: name,
          desc: desc,
        },
      });
      res.status(201).redirect('/admin/channels');
    } catch {
  
    }
  } else{
    return res.status(401).redirect('/dashboard');
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/login');
  }
  res.sendFile(__dirname + "/dashboard/index.html");
});

app.get('/dashboard/channel', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/login');
  }
  res.sendFile(__dirname + "/dashboard/channel.html");
});

// app.get('/dashboard/:file', (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).redirect('/login');
//   }
//   res.sendFile(__dirname + "/dashboard/" + req.params.file);
// });

app.get('/usersettings', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/login');
  }
  res.sendFile(__dirname + "/userpanel/index.html");
});

app.get('/usersettings/:file', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/login');
  }
  res.sendFile(__dirname + "/userpanel/" + req.params.file);
});

app.get('/admin', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/login');
  }
  if (req.user.role == "admin") {
    res.sendFile(__dirname + "/adminpanel/users.html");
  } else{
    return res.status(401).redirect('/dashboard');
  }
});

app.get('/admin/channels', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/login');
  }
  if (req.user.role == "admin") {
    res.sendFile(__dirname + "/adminpanel/channels.html");
  } else{
    return res.status(401).redirect('/dashboard');
  }
});

// app.get('/admin/:file', (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).redirect('/login');
//   }
//   if (req.user.role == "admin") {
//     res.sendFile(__dirname + "/adminpanel/" + req.params.file);
//   } else{
//     return res.status(401).redirect('/dashboard');
//   }
// });

app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <label for="email">Email:</label>
      <input type="email" name="email" id="email" required />

      <label for="password">Password:</label>
      <input type="password" name="password" id="password" required />

      <button type="submit">Login</button>
    </form>
  `);
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.redirect('/login');
  });
});

app.get('/api/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/api/all-users', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(await prisma.user.findMany());
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/api/all-channels', async (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(await prisma.channel.findMany());
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/api/all-messages/:channel', async (req, res) => {
  if (req.isAuthenticated()) {
    const messages = await prisma.channel.findUnique({
      where: { id: parseInt(req.params.channel) },
      select: {
        messages: {
          select: {
            content: true,
            sender: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    res.json(messages.messages)
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/api/get-info/:channel', async (req, res) => {
  if (req.isAuthenticated()) {
    const messages = await prisma.channel.findUnique({
      where: { id: parseInt(req.params.channel) },
    });
    res.json(messages)
  } else {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

app.post('/api/send-message/:channel', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect('/login');
  }

  const { content } = req.body;

  try {
    const sender = await prisma.user.findUnique({
      where: { id: parseInt(req.user.id) },
    });

    if (!sender) {
      return res.status(404).send('Sender not found');
    }

    const channel = await prisma.channel.findUnique({
      where: { id: parseInt(req.params.channel) },
    });

    if (!channel) {
      return res.status(404).send('Channel not found');
    }

    await prisma.message.create({
      data: {
        content: content,
        channel: { connect: { id: channel.id } }, // Connect to the channel
        messagetype: 'message',
        contenttype: 'plaintext',
        sender: { connect: { id: sender.id } }, // Connect to the sender
      },
    });

    res.status(201).redirect(`/dashboard/channel?id=${req.params.channel}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while sending the message');
  }
});



app.delete('/api/delete-user/:id', async (req, res) => {
  const { id } = req.params;
  const requestingUserId = req.user.id;

  try {
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized: Only admins can delete users' });
    }

    const channelToDelete = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!channelToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'channel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting channel', details: error.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
