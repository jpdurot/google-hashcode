# 2019 - slides

Algo with subgroups:

1. Build CompleteSet of photos with tags
1. While CompleteSet is not empty
    1. take x random photos from CompleteSet
        1. for each photo, find best match
        1. if score for first photo < threshold, reduce threshold
        1. if score < threshold, break
    1. put back remaining photos into CompleteSet
