import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required',
    });
  }

  next();
}

export function requireStaff(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  if (req.user.role !== 'staff' && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Staff access required',
    });
  }

  next();
}