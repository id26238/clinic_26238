const API = "";

// ================== TABS ==================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
});

function toast(msg, type='success') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast ' + type + ' show';
    setTimeout(() => el.classList.remove('show'), 2500);
}

async function apiGet(path) { const r = await fetch(API + path); if (!r.ok) throw new Error('GET failed ' + path); return r.json(); }
async function apiPost(path, body) { const r = await fetch(API + path, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); if (!r.ok) throw new Error('POST failed ' + path); return r.json(); }
async function apiPut(path, body) { const r = await fetch(API + path, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); if (!r.ok) throw new Error('PUT failed ' + path); return r.json(); }
async function apiDelete(path) { const r = await fetch(API + path, {method:'DELETE'}); if (!r.ok) throw new Error('DELETE failed ' + path); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function shortId(id) { return id ? id.substring(0,8) + '' : ''; }

// ================== OFFICES ==================
async function loadOffices() {
    try {
        const offices = await apiGet('/api/offices');
        const tbody = document.querySelector('#table-offices tbody');
        tbody.innerHTML = '';
        offices.forEach(o => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mono">${esc(o.id)}</td>
                <td>${esc(o.roomNumber)}</td>
                <td>
                    <button class="btn-edit" onclick="editOffice('${o.id}','${esc(o.roomNumber)}')">Edit</button>
                    <button class="btn-delete" onclick="deleteOffice('${o.id}')">Delete</button>
                </td>`;
            tbody.appendChild(tr);
        });
        const sel = document.getElementById('doctor-office');
        sel.innerHTML = '<option value="">-- no office --</option>';
        offices.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.id;
            opt.textContent = 'Room ' + o.roomNumber;
            sel.appendChild(opt);
        });
    } catch (e) { toast(e.message, 'error'); }
}

document.getElementById('form-office').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('office-id').value;
    const body = { roomNumber: document.getElementById('office-roomNumber').value };
    try {
        if (id) { await apiPut('/api/offices/' + id, body); toast('Office updated'); }
        else    { await apiPost('/api/offices', body);       toast('Office created'); }
        resetOfficeForm(); loadOffices();
    } catch (e) { toast(e.message, 'error'); }
});
function editOffice(id, roomNumber) {
    document.getElementById('office-id').value = id;
    document.getElementById('office-roomNumber').value = roomNumber;
    document.getElementById('office-form-title').textContent = 'Edit Office (ID: ' + id + ')';
}
function resetOfficeForm() {
    document.getElementById('office-id').value = '';
    document.getElementById('office-roomNumber').value = '';
    document.getElementById('office-form-title').textContent = 'Add New Office';
}
async function deleteOffice(id) {
    if (!confirm('Delete office?')) return;
    try { await apiDelete('/api/offices/' + id); toast('Office deleted'); loadOffices(); }
    catch (e) { toast(e.message, 'error'); }
}

// ================== PATIENTS ==================
async function loadPatients() {
    try {
        const patients = await apiGet('/api/patients');
        const tbody = document.querySelector('#table-patients tbody');
        tbody.innerHTML = '';
        patients.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mono">${esc(p.id)}</td>
                <td>${esc(p.firstName)}</td>
                <td>${esc(p.lastName)}</td>
                <td>${esc(p.phoneNumber)}</td>
                <td>
                    <button class="btn-edit" onclick="editPatient('${p.id}','${esc(p.firstName)}','${esc(p.lastName)}','${esc(p.phoneNumber)}')">Edit</button>
                    <button class="btn-delete" onclick="deletePatient('${p.id}')">Delete</button>
                </td>`;
            tbody.appendChild(tr);
        });
    } catch (e) { toast(e.message, 'error'); }
}

document.getElementById('form-patient').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('patient-id').value;
    const body = {
        firstName: document.getElementById('patient-firstName').value,
        lastName: document.getElementById('patient-lastName').value,
        phoneNumber: document.getElementById('patient-phoneNumber').value
    };
    try {
        if (id) { await apiPut('/api/patients/' + id, body); toast('Patient updated'); }
        else    { await apiPost('/api/patients', body);      toast('Patient created'); }
        resetPatientForm(); loadPatients();
    } catch (e) { toast(e.message, 'error'); }
});
function editPatient(id, f, l, p) {
    document.getElementById('patient-id').value = id;
    document.getElementById('patient-firstName').value = f;
    document.getElementById('patient-lastName').value = l;
    document.getElementById('patient-phoneNumber').value = p;
    document.getElementById('patient-form-title').textContent = 'Edit Patient (ID: ' + id + ')';
}
function resetPatientForm() {
    document.getElementById('patient-id').value = '';
    document.getElementById('patient-firstName').value = '';
    document.getElementById('patient-lastName').value = '';
    document.getElementById('patient-phoneNumber').value = '';
    document.getElementById('patient-form-title').textContent = 'Add New Patient';
}
async function deletePatient(id) {
    if (!confirm('Delete patient?')) return;
    try { await apiDelete('/api/patients/' + id); toast('Patient deleted'); loadPatients(); }
    catch (e) { toast(e.message, 'error'); }
}

// ================== SPECIALIZATIONS ==================
async function loadSpecs() {
    try {
        const list = await apiGet('/api/specializations');
        const tbody = document.querySelector('#table-specs tbody');
        tbody.innerHTML = '';
        list.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mono">${esc(s.id)}</td>
                <td>${esc(s.name)}</td>
                <td>
                    <button class="btn-edit" onclick="editSpec('${s.id}','${esc(s.name)}')">Edit</button>
                    <button class="btn-delete" onclick="deleteSpec('${s.id}')">Delete</button>
                </td>`;
            tbody.appendChild(tr);
        });
    } catch (e) { toast(e.message, 'error'); }
}

document.getElementById('form-spec').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('spec-id').value;
    const body = { name: document.getElementById('spec-name').value };
    try {
        if (id) { await apiPut('/api/specializations/' + id, body); toast('Specialization updated'); }
        else    { await apiPost('/api/specializations', body);       toast('Specialization created'); }
        resetSpecForm(); loadSpecs();
    } catch (e) { toast(e.message, 'error'); }
});
function editSpec(id, name) {
    document.getElementById('spec-id').value = id;
    document.getElementById('spec-name').value = name;
    document.getElementById('spec-form-title').textContent = 'Edit Specialization (ID: ' + id + ')';
}
function resetSpecForm() {
    document.getElementById('spec-id').value = '';
    document.getElementById('spec-name').value = '';
    document.getElementById('spec-form-title').textContent = 'Add New Specialization';
}
async function deleteSpec(id) {
    if (!confirm('Delete specialization?')) return;
    try { await apiDelete('/api/specializations/' + id); toast('Specialization deleted'); loadSpecs(); }
    catch (e) { toast(e.message, 'error'); }
}

// ================== DOCTORS ==================
async function loadDoctors() {
    try {
        const doctors = await apiGet('/api/doctors');
        const tbody = document.querySelector('#table-doctors tbody');
        tbody.innerHTML = '';
        doctors.forEach(d => {
            const office = d.office ? d.office.roomNumber : '';
            const officeId = d.office ? d.office.id : '';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mono">${esc(d.id)}</td>
                <td>${esc(d.firstName)}</td>
                <td>${esc(d.lastName)}</td>
                <td>${esc(office)}</td>
                <td>
                    <button class="btn-edit" onclick="editDoctor('${d.id}','${esc(d.firstName)}','${esc(d.lastName)}','${officeId}')">Edit</button>
                    <button class="btn-delete" onclick="deleteDoctor('${d.id}')">Delete</button>
                </td>`;
            tbody.appendChild(tr);
        });
        if (doctors.length > 0) {
            document.getElementById('q1-doctorId').value = doctors[0].id;
            document.getElementById('q5-doctorId').value = doctors[0].id;
        }
    } catch (e) { toast(e.message, 'error'); }
}

document.getElementById('form-doctor').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('doctor-id').value;
    const officeVal = document.getElementById('doctor-office').value;
    const body = {
        firstName: document.getElementById('doctor-firstName').value,
        lastName: document.getElementById('doctor-lastName').value,
        office: officeVal ? { id: officeVal } : null
    };
    try {
        if (id) { await apiPut('/api/doctors/' + id, body); toast('Doctor updated'); }
        else    { await apiPost('/api/doctors', body);       toast('Doctor created'); }
        resetDoctorForm(); loadDoctors();
    } catch (e) { toast(e.message, 'error'); }
});
function editDoctor(id, f, l, officeId) {
    document.getElementById('doctor-id').value = id;
    document.getElementById('doctor-firstName').value = f;
    document.getElementById('doctor-lastName').value = l;
    document.getElementById('doctor-office').value = officeId || '';
    document.getElementById('doctor-form-title').textContent = 'Edit Doctor (ID: ' + id + ')';
}
function resetDoctorForm() {
    document.getElementById('doctor-id').value = '';
    document.getElementById('doctor-firstName').value = '';
    document.getElementById('doctor-lastName').value = '';
    document.getElementById('doctor-form-title').textContent = 'Add New Doctor';
}
async function deleteDoctor(id) {
    if (!confirm('Delete doctor?')) return;
    try { await apiDelete('/api/doctors/' + id); toast('Doctor deleted'); loadDoctors(); }
    catch (e) { toast(e.message, 'error'); }
}

// ================== QUERIES ==================
function renderTable(containerId, columns, rows) {
    const c = document.getElementById(containerId);
    if (!rows || rows.length === 0) { c.innerHTML = '<p style="color:#6b7a90;">(no results)</p>'; return; }
    let html = '<table><thead><tr>';
    columns.forEach(col => html += '<th>' + esc(col) + '</th>');
    html += '</tr></thead><tbody>';
    rows.forEach(r => {
        html += '<tr>';
        columns.forEach(col => html += '<td>' + esc(r[col] ?? '') + '</td>');
        html += '</tr>';
    });
    html += '</tbody></table>';
    c.innerHTML = html;
}

async function runQ1() {
    const id = document.getElementById('q1-doctorId').value.trim();
    const c = document.getElementById('q1-result');
    if (!id) { c.innerHTML = '<p class="error">Please enter a doctor UUID</p>'; return; }
    try {
        const data = await apiGet('/api/test-queries/q1/' + id);
        const list = Array.isArray(data) ? data : [data];
        renderTable('q1-result', ['appointmentDate','reason','status'], list);
    } catch (e) { c.innerHTML = '<p class="error">' + esc(e.message) + '</p>'; }
}

async function runQ2() {
    const c = document.getElementById('q2-result');
    try {
        const data = await apiGet('/api/test-queries/q2');
        const rows = (data || []).map(r => ({
            PatientFirst: r[0], PatientLast: r[1],
            DoctorFirst: r[2],  DoctorLast: r[3],
            Date: r[4]
        }));
        renderTable('q2-result', ['PatientFirst','PatientLast','DoctorFirst','DoctorLast','Date'], rows);
    } catch (e) { c.innerHTML = '<p class="error">' + esc(e.message) + '</p>'; }
}

async function runQ3() {
    const c = document.getElementById('q3-result');
    try {
        const data = await apiGet('/api/test-queries/q3');
        const rows = (data || []).map(r => ({
            DoctorFirst: r[0], DoctorLast: r[1], Count: r[2]
        }));
        renderTable('q3-result', ['DoctorFirst','DoctorLast','Count'], rows);
    } catch (e) { c.innerHTML = '<p class="error">' + esc(e.message) + '</p>'; }
}

async function runQ4() {
    const name = document.getElementById('q4-specName').value.trim();
    const c = document.getElementById('q4-result');
    if (!name) { c.innerHTML = '<p class="error">Please enter a specialization name</p>'; return; }
    try {
        const data = await apiGet('/api/test-queries/q4/' + encodeURIComponent(name));
        const list = Array.isArray(data) ? data : [data];
        renderTable('q4-result', ['appointmentDate','reason','status'], list);
    } catch (e) { c.innerHTML = '<p class="error">' + esc(e.message) + '</p>'; }
}

async function runQ5() {
    const id = document.getElementById('q5-doctorId').value.trim();
    const c = document.getElementById('q5-result');
    if (!id) { c.innerHTML = '<p class="error">Please enter a doctor UUID</p>'; return; }
    try {
        const data = await apiGet('/api/test-queries/q5/' + id);
        const rows = (data.content || []).map(a => ({
            appointmentDate: a.appointmentDate,
            reason: a.reason,
            status: a.status
        }));
        let html = '';
        html += '<p><strong>Page:</strong> ' + data.number +
                ' | <strong>Size:</strong> ' + data.size +
                ' | <strong>Total elements:</strong> ' + data.totalElements +
                ' | <strong>Total pages:</strong> ' + data.totalPages + '</p>';
        c.innerHTML = html;
        const wrapper = document.createElement('div');
        wrapper.id = 'q5-table';
        c.appendChild(wrapper);
        renderTable('q5-table', ['appointmentDate','reason','status'], rows);
    } catch (e) { c.innerHTML = '<p class="error">' + esc(e.message) + '</p>'; }
}

// ================== BOOT ==================
window.addEventListener('DOMContentLoaded', async () => {
    await loadOffices();
    await loadPatients();
    await loadSpecs();
    await loadDoctors();
});