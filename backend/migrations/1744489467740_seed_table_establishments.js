module.exports = {
    "up": "INSERT INTO establishments (name, address, phone, email) VALUES ('رئاسة الحكومة', 'العاصمة - شارع الحبيب بورقيبة', '71234567', 'contact@pm.gov.tn'), ('وزارة الشؤون الخارجية', 'شارع الجمهورية - تونس', '71345678', 'contact@diplomatie.gov.tn'), ('وزارة المالية', 'شارع الاستقلال - تونس', '71456789', 'contact@finances.gov.tn'), ('ولاية تونس', 'ولاية تونس - وسط المدينة', '71567890', 'contact@tunis.gov.tn'), ('بلدية تونس', 'بلدية تونس - المدينة العتيقة', '71678901', 'contact@municipalite.gov.tn') ",
    "down": "DELETE FROM establishments"
}