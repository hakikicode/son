const fetchStats = async () => {
    const res = await fetch('/stats');
    const data = await res.json();
    document.getElementById('userCount').innerText = data.users.length;
    document.getElementById('referralCount').innerText = Object.keys(data.referrals).length;
};

fetchStats();
setInterval(fetchStats, 5000); // Update stats every 5 seconds
