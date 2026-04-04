const db = require('../database/models');

async function createAuditLog({ userId, action, entity, entityId, oldValues, newValues }) {
  await db.AuditLog.create({
    userId,
    action,
    entity,
    entityId: entityId || null,
    oldValues: oldValues || null,
    newValues: newValues || null,
  });
}

module.exports = createAuditLog;