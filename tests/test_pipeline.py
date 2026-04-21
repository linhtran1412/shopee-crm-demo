"""
Unit Tests cho Shopee CRM Big Data Pipeline
Môn: Big Data - Nhóm 18
Dataset: H&M Fashion (31.7M transactions)
"""

import pytest
import json
import os

# ============================================================
# TEST 1: Kiểm tra file JSON export tồn tại và hợp lệ
# ============================================================
class TestDataExport:
    """Kiểm thử các file JSON được export từ Databricks"""

    JSON_FILES = [
        "public/data/rfm_distribution.json",
        "public/data/top_products.json",
        "public/data/model_metrics.json",
        "public/data/voucher_priority.json",
        "public/data/segment_performance.json",
        "public/data/streaming_popularity.json",
        "public/data/purchase_cycle.json",
    ]

    def test_all_json_files_exist(self):
        """Tất cả 7 file JSON phải tồn tại"""
        for f in self.JSON_FILES:
            assert os.path.exists(f), f"❌ File không tồn tại: {f}"

    def test_json_files_are_valid(self):
        """Tất cả file JSON phải parse được"""
        for f in self.JSON_FILES:
            if os.path.exists(f):
                with open(f, "r", encoding="utf-8") as fp:
                    data = json.load(fp)
                assert data is not None, f"❌ JSON rỗng: {f}"

    def test_rfm_distribution_structure(self):
        """rfm_distribution.json phải có metadata + data"""
        path = "public/data/rfm_distribution.json"
        if not os.path.exists(path):
            pytest.skip("File chưa được export từ Databricks")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        assert "metadata" in data, "Thiếu trường metadata"
        assert "data" in data, "Thiếu trường data"
        assert len(data["data"]) > 0, "Dữ liệu RFM rỗng"

    def test_rfm_segments_count(self):
        """Phải có ít nhất 4 phân khúc RFM"""
        path = "public/data/rfm_distribution.json"
        if not os.path.exists(path):
            pytest.skip("File chưa được export từ Databricks")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        segments = data["data"]
        assert len(segments) >= 4, f"Chỉ có {len(segments)} phân khúc, cần ít nhất 4"

    def test_rfm_required_fields(self):
        """Mỗi phân khúc RFM phải có đủ các trường cần thiết"""
        path = "public/data/rfm_distribution.json"
        if not os.path.exists(path):
            pytest.skip("File chưa được export từ Databricks")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        required_fields = ["customer_segment", "customer_count", "percentage"]
        for segment in data["data"]:
            for field in required_fields:
                assert field in segment, f"Thiếu trường '{field}' trong phân khúc RFM"

    def test_rfm_percentage_sums_to_100(self):
        """Tổng phần trăm các phân khúc phải xấp xỉ 100%"""
        path = "public/data/rfm_distribution.json"
        if not os.path.exists(path):
            pytest.skip("File chưa được export từ Databricks")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        total_pct = sum(s["percentage"] for s in data["data"])
        assert abs(total_pct - 100) < 1, f"Tổng phần trăm = {total_pct}%, phải ≈ 100%"

    def test_model_metrics_has_precision_recall(self):
        """model_metrics.json phải có Precision@10 và Recall@10"""
        path = "public/data/model_metrics.json"
        if not os.path.exists(path):
            pytest.skip("File chưa được export từ Databricks")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        metric_names = [m["metric_name"] for m in data["data"]]
        assert "Precision@10" in metric_names, "Thiếu Precision@10"
        assert "Recall@10" in metric_names, "Thiếu Recall@10"

    def test_top_products_not_empty(self):
        """top_products.json phải có sản phẩm"""
        path = "public/data/top_products.json"
        if not os.path.exists(path):
            pytest.skip("File chưa được export từ Databricks")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        assert len(data["data"]) >= 10, "Cần ít nhất 10 sản phẩm top"


# ============================================================
# TEST 2: Kiểm tra logic RFM Scoring (thuần Python)
# ============================================================
class TestRFMLogic:
    """Kiểm thử logic tính điểm RFM"""

    def _score_rfm(self, recency, frequency, monetary,
                   r_max=365, f_max=50, m_max=1.0):
        """Hàm tính RFM score đơn giản (mô phỏng logic Spark)"""
        r_score = max(1, 5 - int((recency / r_max) * 4))
        f_score = min(5, max(1, int((frequency / f_max) * 5)))
        m_score = min(5, max(1, int((monetary / m_max) * 5)))
        return r_score + f_score + m_score

    def _classify_segment(self, rfm_score):
        """Phân loại khách hàng theo điểm RFM"""
        if rfm_score >= 12:
            return "Champions"
        elif rfm_score >= 9:
            return "Loyal Customers"
        elif rfm_score >= 7:
            return "Potential Loyalists"
        elif rfm_score >= 5:
            return "At Risk"
        else:
            return "Lost Customers"

    def test_champion_customer_has_high_score(self):
        """Khách VIP (mua gần đây, thường xuyên, nhiều tiền) phải có điểm cao"""
        score = self._score_rfm(recency=5, frequency=40, monetary=0.9)
        assert score >= 12, f"Champion phải có score >= 12, got {score}"

    def test_lost_customer_has_low_score(self):
        """Khách đã mất (lâu không mua) phải có điểm thấp"""
        score = self._score_rfm(recency=340, frequency=1, monetary=0.01)
        assert score <= 6, f"Lost customer phải có score <= 6, got {score}"

    def test_segment_classification_champions(self):
        """Điểm >= 12 phải là Champions"""
        assert self._classify_segment(13) == "Champions"
        assert self._classify_segment(15) == "Champions"

    def test_segment_classification_at_risk(self):
        """Điểm 5-6 phải là At Risk"""
        assert self._classify_segment(5) == "At Risk"
        assert self._classify_segment(6) == "At Risk"

    def test_rfm_score_range(self):
        """RFM score phải trong khoảng 3-15"""
        for r in [1, 100, 365]:
            for f in [1, 10, 50]:
                for m in [0.01, 0.5, 1.0]:
                    score = self._score_rfm(r, f, m)
                    assert 3 <= score <= 15, f"Score {score} ngoài khoảng [3,15]"


# ============================================================
# TEST 3: Kiểm tra Voucher Timing Logic
# ============================================================
class TestVoucherTiming:
    """Kiểm thử logic dự đoán thời điểm gửi Voucher"""

    def _should_send_voucher(self, days_since_last_purchase, avg_cycle_days,
                              rfm_score, threshold_pct=0.8):
        """
        Logic: Gửi voucher khi khách hàng sắp đến chu kỳ mua hàng
        threshold_pct: gửi khi đã qua X% chu kỳ
        """
        if avg_cycle_days <= 0:
            return False
        cycle_progress = days_since_last_purchase / avg_cycle_days
        is_near_purchase = cycle_progress >= threshold_pct
        is_valuable = rfm_score >= 5
        return is_near_purchase and is_valuable

    def test_send_voucher_when_near_cycle_end(self):
        """Phải gửi voucher khi khách hàng sắp đến chu kỳ"""
        result = self._should_send_voucher(
            days_since_last_purchase=28,
            avg_cycle_days=30,
            rfm_score=10
        )
        assert result is True, "Phải gửi voucher khi cycle_progress >= 80%"

    def test_no_voucher_for_low_rfm(self):
        """Không gửi voucher cho khách hàng không có giá trị"""
        result = self._should_send_voucher(
            days_since_last_purchase=29,
            avg_cycle_days=30,
            rfm_score=2
        )
        assert result is False, "Không gửi voucher cho RFM score thấp"

    def test_no_voucher_too_early_in_cycle(self):
        """Không gửi voucher khi còn quá sớm trong chu kỳ"""
        result = self._should_send_voucher(
            days_since_last_purchase=5,
            avg_cycle_days=30,
            rfm_score=12
        )
        assert result is False, "Không gửi voucher khi mới mua (16% chu kỳ)"

    def test_zero_cycle_days_safe(self):
        """Xử lý an toàn khi cycle_days = 0 (tránh chia cho 0)"""
        result = self._should_send_voucher(
            days_since_last_purchase=10,
            avg_cycle_days=0,
            rfm_score=12
        )
        assert result is False, "Phải trả về False khi avg_cycle_days = 0"
