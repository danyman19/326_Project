import * as authService from "../services/authService.js";

const fromForm = (req) => Boolean(req.is("application/x-www-form-urlencoded"));

const startSession = (req, userId) =>
  new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);

      req.session.userId = userId;

      req.session.save((saveError) => {
        if (saveError) return reject(saveError);
        resolve();
      });
    });
  });

export const signupPage = (req, res) => {
  if (req.user) return res.redirect("/events");

  res.render("signup", {
    error: null,
    email: "",
  });
};

export const loginPage = (req, res) => {
  if (req.user) return res.redirect("/events");

  res.render("login", {
    error: null,
    email: "",
  });
};

export const signup = async (req, res) => {
  const result = await authService.signup(req.body);

  if (!result.ok) {
    if (fromForm(req)) {
      return res.status(result.error.status).render("signup", {
        error: result.error.message,
        email: req.body.email || "",
      });
    }

    return res.status(result.error.status).json({
      error: result.error.message,
    });
  }

  if (fromForm(req)) {
    await startSession(req, result.value.id);
    return res.redirect(303, "/events");
  }

  res.status(201).json(result.value);
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);

  if (!result.ok) {
    if (fromForm(req)) {
      return res.status(result.error.status).render("login", {
        error: result.error.message,
        email: req.body.email || "",
      });
    }

    return res.status(result.error.status).json({
      error: result.error.message,
    });
  }

  await startSession(req, result.value._id.toString());

  if (fromForm(req)) {
    return res.redirect(303, "/events");
  }

  res.status(200).json({ loggedIn: true });
};

export const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie("connect.sid", { path: "/" });

    if (fromForm(req)) {
      return res.redirect(303, "/login");
    }

    res.status(200).json({ loggedOut: true });
  });
};

export const me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: "not logged in",
    });
  }

  res.status(200).json(req.user);
};
